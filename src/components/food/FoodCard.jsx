import { Tag, Clock, Utensils, Store } from 'lucide-react';

const mealTypeBadge = {
  Sarapan: 'bg-amber-100 text-amber-800',
  'Makan Siang': 'bg-emerald-100 text-emerald-800',
  'Makan Malam': 'bg-indigo-100 text-indigo-800',
};

function formatPrice(price) {
  if (price == null) return '-';
  return `Rp ${Number(price).toLocaleString('id-ID')}`;
}

export default function FoodCard({ food, nutrition, showVendor }) {
  const mealType = food.meal_type || food.mealType;
  const badgeColor = mealTypeBadge[mealType] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
          {food.name || food.menu_name}
        </h3>
        <span className="shrink-0 text-emerald-700 font-bold text-sm whitespace-nowrap">
          {formatPrice(food.price)}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {mealType && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            <Clock className="w-3 h-3" />
            {mealType}
          </span>
        )}
        {food.category && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <Tag className="w-3 h-3" />
            {food.category}
          </span>
        )}
      </div>

      {/* Vendor */}
      {showVendor && food.vendor_name && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <Store className="w-3.5 h-3.5" />
          <span>{food.vendor_name}</span>
        </div>
      )}

      {/* Nutrition */}
      {nutrition ? (
        <div className="grid grid-cols-4 gap-2 bg-emerald-50 rounded-lg p-2.5">
          <div className="text-center">
            <p className="text-xs text-gray-500">Kalori</p>
            <p className="text-sm font-semibold text-gray-800">
              {nutrition.calories != null ? nutrition.calories : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Protein</p>
            <p className="text-sm font-semibold text-gray-800">
              {nutrition.protein != null ? `${nutrition.protein}g` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Karbo</p>
            <p className="text-sm font-semibold text-gray-800">
              {nutrition.carbs != null ? `${nutrition.carbs}g` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Lemak</p>
            <p className="text-sm font-semibold text-gray-800">
              {nutrition.fat != null ? `${nutrition.fat}g` : 'N/A'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-sm text-gray-400 italic bg-gray-50 rounded-lg p-2.5">
          <Utensils className="w-3.5 h-3.5" />
          <span>Informasi gizi belum tersedia</span>
        </div>
      )}
    </div>
  );
}
