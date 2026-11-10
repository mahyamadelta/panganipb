import React from 'react';
import { Sparkles, Trash2, RefreshCw } from 'lucide-react';

export default function ImagePreview({
  imageUrl,
  file,
  onRemove,
  onAnalyze,
  isLoading,
  loadingMessage = 'Menganalisis foto dengan AI...',
}) {
  if (!imageUrl) return null;

  const fileSizeKb = file ? Math.round(file.size / 1024) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video max-h-72 flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Preview foto makanan"
          className="w-full h-full object-contain"
        />

        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 p-4 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm font-medium">{loadingMessage}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs text-slate-500 truncate">
          <span className="font-semibold text-slate-700 block truncate">{file?.name || 'Foto Makanan'}</span>
          <span>{fileSizeKb} KB</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRemove}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isLoading}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-400 transition shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isLoading ? 'Menganalisis...' : 'Analisis Makanan'}
          </button>
        </div>
      </div>
    </div>
  );
}
