/**
 * Frontend service for the food scanner.
 * Sends an image to the backend AI analysis endpoint and returns
 * structured nutrition / food-identification results.
 */

/**
 * Analyse a food image via the backend Gemini-powered endpoint.
 *
 * @param {File} imageFile - The image file selected / captured by the user.
 * @returns {Promise<Object>} Parsed JSON response with food analysis results.
 * @throws {Error} With a user-friendly message in Bahasa Indonesia.
 */
export async function analyzeFood(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 95000); // 95s client timeout

  let response;
  try {
    response = await fetch('/api/analyze-food', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(
        'Permintaan melebihi batas waktu (95 detik). Pastikan koneksi internet stabil atau coba gunakan foto berukuran lebih kecil.'
      );
    }
    console.error('Fetch error during /api/analyze-food:', err);
    throw new Error(
      'Gagal terhubung ke server. Pastikan server dev (npm run dev) sedang aktif.'
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.message ||
      `Server mengembalikan kode ${response.status}. Silakan coba lagi.`;
    throw new Error(message);
  }

  return response.json();
}
