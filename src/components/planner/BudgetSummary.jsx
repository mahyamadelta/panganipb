import React from 'react';
import { DollarSign, Wallet, ShieldCheck, Flame, Info } from 'lucide-react';
import { formatPrice } from '../../utils/nutritionCalculator';

export default function BudgetSummary({ combination, budget, nutritionSummary }) {
  if (!combination) return null;

  const totalPrice = combination.totalPrice || 0;
  const remainingBudget = Math.max(0, budget - totalPrice);
  const percentageUsed = Math.min(100, Math.round((totalPrice / budget) * 100));

  let progressColor = 'bg-emerald-500';
  if (percentageUsed > 85) progressColor = 'bg-amber-500';
  if (percentageUsed > 95) progressColor = 'bg-rose-500';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-4">
      <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-emerald-600" />
        Ringkasan Biaya & Nutrisi Harian
      </h4>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 block mb-0.5">Total Biaya 3 Menu</span>
          <span className="text-lg font-bold text-slate-900">{formatPrice(totalPrice)}</span>
        </div>
        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
          <span className="text-xs text-emerald-700 block mb-0.5">Sisa Budget</span>
          <span className="text-lg font-bold text-emerald-700">{formatPrice(remainingBudget)}</span>
        </div>
        <div className="col-span-2 md:col-span-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 block mb-0.5">Penggunaan Budget</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold text-slate-800">{percentageUsed}%</span>
            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-300`}
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aggregated Nutrition Summary */}
      {nutritionSummary && (
        <div className="border-t border-slate-100 pt-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Perkiraan Nutrisi Total (dari menu dengan data gizi)
            </span>
            {nutritionSummary.completenessRate < 1 && (
              <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                {Math.round(nutritionSummary.completenessRate * 3)}/3 menu tercatat gizinya
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Kalori Total</span>
              <span className="font-bold text-slate-800 text-sm">
                {nutritionSummary.calories != null ? `${nutritionSummary.calories} kkal` : 'N/A'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Protein</span>
              <span className="font-bold text-slate-800 text-sm">
                {nutritionSummary.protein != null ? `${nutritionSummary.protein}g` : 'N/A'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Karbohidrat</span>
              <span className="font-bold text-slate-800 text-sm">
                {nutritionSummary.carbohydrates != null ? `${nutritionSummary.carbohydrates}g` : 'N/A'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Lemak</span>
              <span className="font-bold text-slate-800 text-sm">
                {nutritionSummary.fat != null ? `${nutritionSummary.fat}g` : 'N/A'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-center border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 block">Serat</span>
              <span className="font-bold text-slate-800 text-sm">
                {nutritionSummary.fiber != null ? `${nutritionSummary.fiber}g` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimers (MP-12 & transparency) */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-xs text-slate-500 space-y-1">
        <p className="flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Nilai nutrisi merupakan estimasi porsi standar. Menu tanpa catatan gizi resmi tidak dihitung sebagai nol.
          </span>
        </p>
        <p className="flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Rekomendasi ini bertujuan membantu pertimbangan belanja harian dan bukan merupakan pengganti saran medis/gizi klinis individual.
          </span>
        </p>
      </div>
    </div>
  );
}
