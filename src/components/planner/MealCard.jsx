import React from 'react';
import { Sunrise, Sun, Moon, MapPin, Activity } from 'lucide-react';
import { formatPrice } from '../../utils/nutritionCalculator';

const MEAL_CONFIG = {
  breakfast: {
    label: 'Sarapan',
    icon: Sunrise,
    headerBg: 'bg-amber-50',
    headerText: 'text-amber-800',
    borderColor: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-800',
  },
  lunch: {
    label: 'Makan Siang',
    icon: Sun,
    headerBg: 'bg-emerald-50',
    headerText: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800',
  },
  dinner: {
    label: 'Makan Malam',
    icon: Moon,
    headerBg: 'bg-indigo-50',
    headerText: 'text-indigo-800',
    borderColor: 'border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-800',
  },
};

export default function MealCard({ meal, mealType, nutrition, restaurant }) {
  const config = MEAL_CONFIG[mealType] || MEAL_CONFIG.lunch;
  const Icon = config.icon;

  if (!meal) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-400 bg-slate-50">
        Belum ada menu terpilih
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${config.borderColor} bg-white shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition`}>
      {/* Meal Period Header */}
      <div className={`px-4 py-2.5 ${config.headerBg} border-b ${config.borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.headerText}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${config.headerText}`}>
            {config.label}
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 shadow-2xs">
          {formatPrice(meal.price)}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-800 mb-1 leading-snug">
            {meal.name}
          </h4>

          {restaurant ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{restaurant.name}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic mb-3">Lokasi vendor tidak tercatat</div>
          )}
        </div>

        {/* Nutrition snippet */}
        <div className="pt-3 border-t border-slate-100">
          {nutrition ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 text-slate-500">
                  <Activity className="w-3 h-3 text-emerald-600" />
                  Energi
                </span>
                <span className="font-bold text-slate-800">{nutrition.calories} kkal</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-1">
                <div className="bg-slate-50 rounded py-1 px-1">
                  <span className="text-slate-400 block text-[10px]">Prot</span>
                  <span className="font-semibold text-slate-700">{nutrition.protein}g</span>
                </div>
                <div className="bg-slate-50 rounded py-1 px-1">
                  <span className="text-slate-400 block text-[10px]">Karbo</span>
                  <span className="font-semibold text-slate-700">{nutrition.carbohydrates}g</span>
                </div>
                <div className="bg-slate-50 rounded py-1 px-1">
                  <span className="text-slate-400 block text-[10px]">Lemak</span>
                  <span className="font-semibold text-slate-700">{nutrition.fat}g</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic bg-slate-50 rounded p-2 text-center">
              Data gizi spesifik belum diverifikasi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
