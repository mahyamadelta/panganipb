import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

export default function ImageUpload({ onImageSelect, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndPassFile = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Format file tidak didukung. Mohon gunakan format JPEG, PNG, atau WebP.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('Ukuran file terlalu besar. Maksimal ukuran gambar adalah 4 MB.');
      return;
    }

    setError('');
    onImageSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-slate-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={isLoading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <Camera className="w-8 h-8" />
          </div>

          <div>
            <p className="text-base font-semibold text-slate-800">
              Pilih atau seret foto makanan ke sini
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Mendukung JPEG, PNG, dan WebP (Maksimal 4 MB)
            </p>
          </div>

          <button
            type="button"
            disabled={isLoading}
            className="mt-2 px-5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-2xs pointer-events-none"
          >
            Pilih Foto dari Perangkat
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
