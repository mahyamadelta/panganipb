import React, { useState } from 'react';
import { Camera, Sparkles, AlertCircle, RefreshCw, Info } from 'lucide-react';
import ImageUpload from '../components/scanner/ImageUpload';
import ImagePreview from '../components/scanner/ImagePreview';
import AnalysisResult from '../components/scanner/AnalysisResult';
import { analyzeFood } from '../services/aiService';
import { findNutritionMatch } from '../utils/foodMatcher';
import { compressImage } from '../utils/imageCompressor';

export default function FoodScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [matchedNutrition, setMatchedNutrition] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setMatchedNutrition(null);
    setErrorMessage('');
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setMatchedNutrition(null);
    setErrorMessage('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMessage('');
    setAnalysisResult(null);
    setMatchedNutrition(null);

    try {
      // Step 1: Optimize and compress image on client-side
      setLoadingStep('Mengoptimalkan ukuran foto...');
      const fileToSend = await compressImage(selectedFile, 1280, 1280, 0.85);

      // Step 2: Send to AI endpoint
      setLoadingStep('Mengirim foto ke model Gemini Vision...');
      const response = await analyzeFood(fileToSend);

      // Step 3: Parse result
      setLoadingStep('Memverifikasi data nutrisi resmi...');

      if (!response.identified || !response.result) {
        setErrorMessage(
          response.message || 'Gambar tidak teridentifikasi sebagai makanan.'
        );
        return;
      }

      const result = response.result;
      setAnalysisResult(result);

      // Match primary food name against our curated database
      const match = findNutritionMatch(result.primaryFood);
      setMatchedNutrition(match);
    } catch (err) {
      console.error('Scan error:', err);
      setErrorMessage(
        err.message ||
          'Gagal menganalisis gambar. Pastikan koneksi internet aktif dan coba lagi.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // If user clicks an alternative food name
  const handleSelectAlternative = (altName) => {
    if (!analysisResult) return;

    const updatedResult = {
      ...analysisResult,
      primaryFood: altName,
    };
    setAnalysisResult(updatedResult);

    const match = findNutritionMatch(altName);
    setMatchedNutrition(match);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Camera className="w-6 h-6 text-emerald-600" />
          AI Food Scanner & Kurasi Gizi
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Identifikasi hidangan Indonesia menggunakan penglihatan AI, lalu periksa kandungan gizi resmi dari database kurasi kami.
        </p>
      </div>

      {/* Upload or Preview Box */}
      {!previewUrl ? (
        <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />
      ) : (
        <div className="space-y-4">
          <ImagePreview
            imageUrl={previewUrl}
            file={selectedFile}
            onRemove={handleRemoveImage}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingMessage={loadingStep}
          />
        </div>
      )}

      {/* Analysis Result or Error */}
      <AnalysisResult
        result={analysisResult}
        nutrition={matchedNutrition}
        onSelectAlternative={handleSelectAlternative}
        isLoading={isLoading}
        loadingMessage={loadingStep}
        error={errorMessage}
      />

      {/* Guidelines & Safety Disclaimers */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>Panduan Pengambilan & Hasil Scan:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-slate-500 text-[11px]">
          <li>
            Ambil foto dari jarak dekat dengan pencahayaan cukup untuk hasil identifikasi terbaik.
          </li>
          <li>
            Model AI bertugas mengenali <strong>nama hidangan</strong>. Angka kalori dan nutrisi <strong>tidak dibuat oleh AI</strong>, melainkan dicocokkan ke database terverifikasi kami.
          </li>
          <li>
            Kandungan nutrisi merujuk pada porsi referensi standar. Porsi hidangan nyata di warung mungkin berbeda.
          </li>
          <li>
            Foto yang Anda unggah hanya diproses untuk analisis dan <strong>tidak disimpan</strong> di server kami.
          </li>
        </ul>
      </div>
    </div>
  );
}
