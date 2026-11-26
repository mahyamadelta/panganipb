import { Flame, Beef, Wheat, Droplets, Leaf } from 'lucide-react';

export default function NutritionCard({ nutrition, showServingSize }) {
  if (!nutrition) return null;

  const nutrients = [
    {
      label: 'Kalori',
      value: nutrition.calories,
      unit: 'kkal',
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      label: 'Protein',
      value: nutrition.protein,
      unit: 'g',
      icon: Beef,
      color: 'text-red-500',
    },
    {
      label: 'Karbohidrat',
      value: nutrition.carbohydrates ?? nutrition.carbs,
      unit: 'g',
      icon: Wheat,
      color: 'text-amber-500',
    },
    {
      label: 'Lemak',
      value: nutrition.fat,
      unit: 'g',
      icon: Droplets,
      color: 'text-blue-500',
    },
    {
      label: 'Serat',
      value: nutrition.fiber,
      unit: 'g',
      icon: Leaf,
      color: 'text-green-500',
    },
  ];

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-3">
      {showServingSize && (nutrition.servingSize || nutrition.serving_size) && (
        <p className="text-sm text-emerald-700 font-medium">
          Porsi Acuan: {nutrition.servingSize || nutrition.serving_size}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {nutrients.map(({ label, value, unit, icon: Icon, color }) => (
          <div
            key={label}
            className="flex flex-col items-center bg-white rounded-lg p-2.5 shadow-sm"
          >
            <Icon className={`w-4 h-4 ${color} mb-1`} />
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-sm font-bold text-gray-800">
              {value != null ? `${value} ${unit}` : 'N/A'}
            </span>
          </div>
        ))}
      </div>

      {nutrition.source && (
        <p className="text-xs text-emerald-600 text-center pt-1">
          Sumber: {nutrition.source}
        </p>
      )}
    </div>
  );
}
