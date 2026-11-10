import dns from 'node:dns';
import { GoogleGenAI } from '@google/genai';

// Fix WSL2 IPv6 stalling: prioritize IPv4 to avoid 20-30s TCP timeouts
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

// Cache discovered model so we only check once
let cachedWorkingModel = null;

async function getAvailableModel(apiKey) {
  if (cachedWorkingModel) return cachedWorkingModel;

  try {
    console.log('[API] Mencari model aktif langsung dari Google AI catalog...');
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (res.ok) {
      const data = await res.json();
      const models = (data.models || [])
        .filter((m) =>
          Array.isArray(m.supportedGenerationMethods) &&
          m.supportedGenerationMethods.includes('generateContent')
        )
        .map((m) => m.name.replace(/^models\//, ''));

      console.log(`[API] Ditemukan ${models.length} model aktif dari akun:`, models.slice(0, 8));

      // Pick the best fast vision model in order of preference
      const preference = [
        'gemini-3.5-flash-lite',
        'gemini-3.5-flash',
        'gemini-3.8-flash-lite',
        'gemini-3.8-flash',
        'gemini-2.5-flash',
      ];

      for (const pref of preference) {
        if (models.includes(pref)) {
          cachedWorkingModel = pref;
          console.log(`[API] Memilih model aktif terbaik: ${cachedWorkingModel}`);
          return cachedWorkingModel;
        }
      }

      // Fallback to any flash model
      const anyFlash = models.find((m) => m.includes('flash'));
      if (anyFlash) {
        cachedWorkingModel = anyFlash;
        console.log(`[API] Memilih model flash aktif: ${cachedWorkingModel}`);
        return cachedWorkingModel;
      }

      // Fallback to any gemini model
      const anyGemini = models.find((m) => m.includes('gemini'));
      if (anyGemini) {
        cachedWorkingModel = anyGemini;
        return cachedWorkingModel;
      }
    }
  } catch (err) {
    console.warn('[API Warning] Gagal list models, menggunakan default:', err.message);
  }

  // Safe fallback specifically recommended by Google's response
  cachedWorkingModel = 'gemini-3.5-flash-lite';
  return cachedWorkingModel;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      identified: false,
      message: 'Metode request tidak diizinkan. Gunakan metode POST.',
    });
  }

  const startTime = Date.now();

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'replace_with_server_side_api_key') {
      return res.status(500).json({
        identified: false,
        message: 'Kunci API Gemini belum dikonfigurasi di .env.local.',
      });
    }

    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({
        identified: false,
        message: 'Format request tidak valid. Harus multipart/form-data.',
      });
    }

    // Buffer stream
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Extract boundary
    const boundaryMatch = contentType.match(/boundary=(?:["']?)([^"';]+)(?:["']?)/);
    const boundary = boundaryMatch ? boundaryMatch[1] : null;
    if (!boundary) {
      return res.status(400).json({
        identified: false,
        message: 'Boundary form-data tidak valid.',
      });
    }

    const separator = Buffer.from('--' + boundary);
    let imageData = null;
    let imageMimeType = null;

    let start = 0;
    while (start < buffer.length) {
      const idx = buffer.indexOf(separator, start);
      if (idx === -1) break;

      const nextIdx = buffer.indexOf(separator, idx + separator.length);
      const part = nextIdx !== -1 ? buffer.subarray(idx, nextIdx) : buffer.subarray(idx);

      const headerEndIdx = part.indexOf('\r\n\r\n');
      if (headerEndIdx !== -1) {
        const headers = part.subarray(0, headerEndIdx).toString('utf-8');
        const mimeMatch = headers.match(/Content-Type:\s*(image\/(?:jpeg|png|webp))/i);
        if (mimeMatch) {
          imageMimeType = mimeMatch[1].toLowerCase();
          let rawData = part.subarray(headerEndIdx + 4);
          if (
            rawData.length >= 2 &&
            rawData[rawData.length - 2] === 13 &&
            rawData[rawData.length - 1] === 10
          ) {
            rawData = rawData.subarray(0, rawData.length - 2);
          } else if (rawData.length >= 1 && rawData[rawData.length - 1] === 10) {
            rawData = rawData.subarray(0, rawData.length - 1);
          }
          imageData = rawData;
          break;
        }
      }

      if (nextIdx === -1) break;
      start = nextIdx;
    }

    if (!imageData || !imageMimeType || imageData.length === 0) {
      return res.status(400).json({
        identified: false,
        message: 'File gambar tidak ditemukan atau format tidak didukung.',
      });
    }

    console.log(`[API] Foto berhasil diterima (${Math.round(imageData.length / 1024)} KB)`);

    // Detect actual active model
    const activeModel = await getAvailableModel(apiKey);
    console.log(`[API] Menjalankan inferensi dengan model: ${activeModel}...`);

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 30000,
      },
    });

    const prompt = `Identifikasi hidangan makanan khas Indonesia dalam gambar ini.
Kembalikan HANYA format JSON valid tanpa kata pengantar atau markdown lain:
{
  "primaryFood": "nama hidangan Indonesia (contoh: Nasi Goreng, Ayam Geprek, Sayur Asem, Bakso)",
  "confidence": "high",
  "alternatives": ["alternatif nama 1", "alternatif nama 2"],
  "description": "deskripsi singkat dalam 1 kalimat"
}
Jika gambar bukan makanan, isi "primaryFood": null.`;

    const base64Image = imageData.toString('base64');

    // Build configuration
    const config = {
      maxOutputTokens: 250,
    };

    // Disable thinking budget to ensure instant 1-2s response
    try {
      config.thinkingConfig = {
        thinkingBudget: 0,
      };
    } catch (e) {}

    let responseText = null;
    try {
      const resModel = await ai.models.generateContent({
        model: activeModel,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imageMimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        config,
      });
      responseText = resModel.text;
    } catch (modelErr) {
      console.warn(`[API Warning] Percobaan model ${activeModel} gagal: ${modelErr.message}`);

      // If current model failed, clear cache and try gemini-3.5-flash-lite directly
      cachedWorkingModel = null;
      const fallbackModel = 'gemini-3.5-flash-lite';
      console.log(`[API] Mencoba model fallback darurat: ${fallbackModel}...`);

      const resFallback = await ai.models.generateContent({
        model: fallbackModel,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imageMimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        config: { maxOutputTokens: 250 },
      });
      responseText = resFallback.text;
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[API] Berhasil menerima respons dalam ${elapsed}s!`);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[API Error] Respons bukan JSON:', responseText);
      return res.status(502).json({
        identified: false,
        message: 'Respons dari AI tidak valid. Silakan coba kembali.',
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.primaryFood) {
      return res.status(200).json({
        identified: false,
        message: parsed.description || 'Gambar tidak teridentifikasi sebagai makanan.',
        result: null,
      });
    }

    console.log(`[API] Hasil analisis: "${parsed.primaryFood}"`);

    return res.status(200).json({
      identified: true,
      result: {
        primaryFood: parsed.primaryFood,
        confidence: parsed.confidence || 'high',
        alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : [],
        description: parsed.description || '',
      },
    });
  } catch (err) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`[API Error setelah ${elapsed}s]:`, err);

    return res.status(500).json({
      identified: false,
      message: `Gagal memproses gambar (${err.message || 'Kesalahan server'}). Silakan coba kembali.`,
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
