import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function MapFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMealType,
  onMealTypeChange,
  categories = [],
  onReset,
}) {
  const hasActiveFilters = Boolean(
    (searchQuery && searchQuery.trim() !== '') ||
    selectedCategory ||
    selectedMealType
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari warung, kantin, atau nama makanan..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Type Filter */}
        <div className="relative md:col-span-3">
          <select
            value={selectedMealType}
            onChange={(e) => onMealTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-700 cursor-pointer"
          >
            <option value="">Semua Waktu Makan</option>
            <option value="breakfast">Sarapan</option>
            <option value="lunch">Makan Siang</option>
            <option value="dinner">Makan Malam</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="md:col-span-1 flex justify-end">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              title="Reset Filter"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition text-sm w-full md:w-auto"
            >
              <X className="w-5 h-5" />
              <span className="md:hidden ml-1 text-xs">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
