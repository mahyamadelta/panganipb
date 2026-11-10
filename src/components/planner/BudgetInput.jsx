import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import { validateBudget } from '../../utils/budgetCalculator';

export default function BudgetInput({ onSubmit, isLoading, initialBudget = 25000 }) {
  const [budget, setBudget] = useState(initialBudget ? String(initialBudget) : '');
  const [error, setError] = useState('');

  const quickBudgets = [20000, 25000, 30000, 40000];

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(budget);
    const validation = validateBudget(num);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    setError('');
    onSubmit(num);
  };

  const handleSelectQuick = (val) => {
    setBudget(String(val));
    setError('');
    onSubmit(val);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="budget-input" className="block text-sm font-semibold text-slate-800 mb-1">
            Target Budget Makanan Harian
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Rentang umum mahasiswa: Rp 20.000 – Rp 30.000 per hari (sarapan, makan siang, & makan malam).
          </p>

          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-medium text-base">
              Rp
            </div>
            <input
              id="budget-input"
              type="number"
              step="1000"
              min="5000"
              max="500000"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: 25000"
              className="w-full pl-12 pr-32 py-3 border border-slate-300 rounded-xl text-lg font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              disabled={isLoading}
            />
            <div className="absolute inset-y-1 right-1 flex items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="h-full px-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg text-sm flex items-center gap-1.5 transition shadow-sm"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Memproses...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Cari Menu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">Pilihan cepat:</span>
          {quickBudgets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleSelectQuick(val)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                Number(budget) === val
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Rp {val.toLocaleString('id-ID')}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
