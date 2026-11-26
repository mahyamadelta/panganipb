import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Info, Sparkles, BookOpen } from 'lucide-react';
import NutritionCard from '../food/NutritionCard';

export default function AnalysisResult({
  result,
  nutrition,
  onSelectAlternative,
  isLoading,
  loadingMessage = 'Menganalisis gambar dengan Google Gemini Vision...',
  error,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-600">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{loadingMessage}</p>
          <p className="text-xs text-slate-500 mt-1">
            Mengenali hidangan & mencocokkan ke basis data nutrisi resmi...
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 pt-2 max-w-sm mx-auto">
          <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-bold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Gagal Menganalisis Foto</span>
        </div>
        <p className="text-sm text-slate-600">{error}</p>
        <p className="text-xs text-slate-500">
          Pastikan foto jelas menampilkan makanan khas Indonesia atau coba gunakan foto lainnya.
        </p>
      </div>
    );
  }

  if (!result) return null;

  const { primaryFood, confidence, alternatives = [], description } = result;

  const confidenceBadge = {
    high: { text: 'Keyakinan Tinggi', bg: 'bg-emerald-100 text-emerald-800' },
    medium: { text: 'Keyakinan Sedang', bg: 'bg-amber-100 text-amber-800' },
    low: { text: 'Keyakinan Rendah', bg: 'bg-slate-100 text-slate-700' },
  }[confidence] || { text: 'Teridentifikasi', bg: 'bg-slate-100 text-slate-700' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-500 font-medium">Hasil Identifikasi AI:</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${confidenceBadge.bg}`}>
              {confidenceBadge.text}
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {primaryFood}
          </h3>
          {description && (
            <p className="text-xs text-slate-600 mt-1 italic">{description}</p>
          )}
        </div>

        <div className="shrink-0 flex items-center">
          {nutrition ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tercatat di Database</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Gizi Belum Terdata</span>
            </div>
          )}
        </div>
      </div>

      {/* Alternatives */}
      {alternatives && alternatives.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">
            Alternatif kemungkinan menu:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {alternatives.map((alt) => (
              <button
                key={alt}
                type="button"
                onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-700 border border-slate-200 transition"
              >
                {alt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Section */}
      {nutrition ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Kandungan Nutrisi (Database Terverifikasi)
            </h4>
          </div>

          <NutritionCard nutrition={nutrition} showServingSize={true} />

          {/* Transparency note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
            <p className="flex items-start gap-1.5">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Prinsip Transparansi:</strong> Nilai gizi di atas berasal dari database kurasi (TKPI/sumber resmi), <strong>bukan hasil karangan AI</strong>.
              </span>
            </p>
            <p className="text-[11px] text-slate-500 pl-5">
              Catatan: Estimasi dihitung berdasarkan ukuran porsi acuan standar. Porsi sebenarnya pada foto dapat berbeda.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
          <div className="font-semibold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span>Informasi Gizi Belum Tersedia di Database Kurasi</span>
          </div>
          <p className="text-slate-700">
            AI berhasil mengenali makanan sebagai <strong>{primaryFood}</strong>, namun belum ada catatan gizi yang diverifikasi untuk menu ini dalam dataset IPB Food Equity.
          </p>
          <p className="text-[11px] text-slate-500 italic">
            Sesuai prinsip sistem kami, kami tidak mengarang angka kalori atau makronutrien saat data resmi belum terverifikasi.
          </p>
        </div>
      )}
    </div>
  );
}
