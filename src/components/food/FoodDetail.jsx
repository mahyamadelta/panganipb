import { X, MapPin, Store, Clock, Utensils, Info } from 'lucide-react';

function formatPrice(price) {
  if (price == null) return '-';
  return `Rp ${Number(price).toLocaleString('id-ID')}`;
}

export default function FoodDetail({ food, nutrition, restaurant, onClose }) {
  const mealType = food.meal_type || food.mealType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{food.name || food.menu_name}</h2>
            <p className="text-emerald-700 font-semibold text-lg mt-0.5">{formatPrice(food.price)}</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Vendor & Location */}
          {restaurant && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{restaurant.name || restaurant.vendor_name}</span>
              </div>
              {(restaurant.address || restaurant.location) && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{restaurant.address || restaurant.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Meal Type */}
          {mealType && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Waktu makan: <strong>{mealType}</strong></span>
            </div>
          )}

          {/* Nutrition Table */}
          {nutrition ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-600" />
                Informasi Gizi
              </h3>

              {nutrition.serving_size && (
                <p className="text-sm text-gray-500">
                  Porsi: {nutrition.serving_size}
                </p>
              )}

              <div className="bg-emerald-50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-emerald-100">
                      <td className="px-4 py-2.5 text-gray-600 font-medium">Kalori</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                        {nutrition.calories != null ? `${nutrition.calories} kkal` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-100">
                      <td className="px-4 py-2.5 text-gray-600 font-medium">Protein</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                        {nutrition.protein != null ? `${nutrition.protein} g` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-100">
                      <td className="px-4 py-2.5 text-gray-600 font-medium">Karbohidrat</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                        {nutrition.carbs != null ? `${nutrition.carbs} g` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-emerald-100">
                      <td className="px-4 py-2.5 text-gray-600 font-medium">Lemak</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                        {nutrition.fat != null ? `${nutrition.fat} g` : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-600 font-medium">Serat</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                        {nutrition.fiber != null ? `${nutrition.fiber} g` : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Portion note */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">
                  Nilai gizi berdasarkan porsi standar. Porsi sebenarnya dapat berbeda.
                </p>
              </div>

              {/* Source */}
              {nutrition.source && (
                <p className="text-xs text-gray-400">Sumber data: {nutrition.source}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 italic bg-gray-50 rounded-lg p-4">
              <Utensils className="w-4 h-4" />
              <span>Informasi gizi tidak tersedia untuk menu ini</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
