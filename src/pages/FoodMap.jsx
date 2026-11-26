import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Clock,
  Store,
  Calendar,
  Utensils,
  ChevronRight,
  X,
  List,
  Map as MapIcon,
  Search,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import MapView from '../components/map/MapView';
import MapFilter from '../components/map/MapFilter';
import FoodDetail from '../components/food/FoodDetail';
import {
  getAllRestaurants,
  getAllFoods,
  getFoodsByRestaurant,
  getNutritionForFood,
  getUniqueCategories,
} from '../services/foodService';
import { formatPrice } from '../utils/nutritionCalculator';

export default function FoodMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [activeTabMobile, setActiveTabMobile] = useState('map'); // 'map' | 'list'

  const allRestaurants = useMemo(() => getAllRestaurants(), []);
  const allFoods = useMemo(() => getAllFoods(), []);
  const categories = useMemo(() => getUniqueCategories(), []);

  // Filter restaurants based on query, category, and mealType
  const filteredRestaurants = useMemo(() => {
    return allRestaurants.filter((vendor) => {
      // 1. Category check
      if (
        selectedCategory &&
        vendor.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      const vendorFoods = getFoodsByRestaurant(vendor.id);

      // 2. Meal type check
      if (selectedMealType) {
        const hasMealType = vendorFoods.some(
          (f) => (f.mealType || f.meal_type) === selectedMealType
        );
        if (!hasMealType) return false;
      }

      // 3. Search query check (matches vendor name, address, or any menu name)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = vendor.name.toLowerCase().includes(q);
        const matchesAddress = vendor.address.toLowerCase().includes(q);
        const matchesMenu = vendorFoods.some((f) =>
          f.name.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesAddress && !matchesMenu) {
          return false;
        }
      }

      return true;
    });
  }, [allRestaurants, searchQuery, selectedCategory, selectedMealType]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedMealType('');
  };

  const handleSelectVendor = (vendor) => {
    setSelectedRestaurant(vendor);
  };

  // Get menus for selected vendor
  const vendorMenus = useMemo(() => {
    if (!selectedRestaurant) return [];
    return getFoodsByRestaurant(selectedRestaurant.id);
  }, [selectedRestaurant]);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Peta Makanan Sekitar IPB Dramaga
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Jelajahi warung & kantin yang telah diverifikasi langsung oleh tim.
          </p>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex sm:hidden rounded-lg bg-slate-200 p-0.5 self-start">
          <button
            type="button"
            onClick={() => setActiveTabMobile('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTabMobile === 'map'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Peta
          </button>
          <button
            type="button"
            onClick={() => setActiveTabMobile('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTabMobile === 'list'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Daftar ({filteredRestaurants.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <MapFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMealType={selectedMealType}
        onMealTypeChange={setSelectedMealType}
        categories={categories}
        onReset={handleResetFilters}
      />

      {/* Main Grid: List on Left, Map on Right (Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Vendor List (Desktop sidebar or Mobile tab) */}
        <div
          className={`lg:col-span-5 space-y-3 ${
            activeTabMobile === 'map' ? 'hidden sm:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan <strong>{filteredRestaurants.length}</strong> tempat makan
            </span>
            {searchQuery && <span>Hasil pencarian "{searchQuery}"</span>}
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredRestaurants.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                <Store className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  Tidak ada tempat makan yang sesuai
                </p>
                <p className="text-xs text-slate-500">
                  Coba ubah kata kunci pencarian atau reset filter.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 text-xs font-semibold text-emerald-700 underline"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              filteredRestaurants.map((vendor) => {
                const menus = getFoodsByRestaurant(vendor.id);
                const isSelected = selectedRestaurant?.id === vendor.id;

                return (
                  <div
                    key={vendor.id}
                    onClick={() => handleSelectVendor(vendor)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition shadow-2xs hover:shadow-sm ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {vendor.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        {vendor.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{vendor.address}</span>
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {vendor.openingHours || 'Jam buka belum tercatat'}
                      </span>
                      <span className="font-medium text-emerald-700">
                        {menus.length} menu disurvei
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Map View */}
        <div
          className={`lg:col-span-7 ${
            activeTabMobile === 'list' ? 'hidden sm:block' : 'block'
          }`}
        >
          <div className="sticky top-4 space-y-4">
            <MapView
              vendors={filteredRestaurants}
              height="550px"
              onSelectVendor={handleSelectVendor}
            />

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
              Peta berpusat di Kampus IPB Dramaga. Klik pin pada peta untuk melihat informasi vendor.
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vendor Detail Drawer / Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="bg-emerald-800 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100">
                    {selectedRestaurant.category}
                  </span>
                  {selectedRestaurant.verified && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      Terverifikasi
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold">{selectedRestaurant.name}</h2>
                <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedRestaurant.address}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                className="p-1.5 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vendor Metadata */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Jam Operasional: <strong>{selectedRestaurant.openingHours || 'Belum tercatat'}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                Terakhir verifikasi: <strong>{selectedRestaurant.lastUpdated || '2026-10'}</strong>
              </span>
            </div>

            {/* Menu List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-600" />
                Menu yang Disurvei ({vendorMenus.length})
              </h3>

              {vendorMenus.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  Belum ada menu spesifik yang disurvei untuk vendor ini.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {vendorMenus.map((food) => {
                    const nutrition = getNutritionForFood(food);
                    return (
                      <div
                        key={food.id}
                        onClick={() => setSelectedFoodItem(food)}
                        className="p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-800">
                              {food.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-medium">
                              {food.mealType}
                            </span>
                          </div>
                          {nutrition ? (
                            <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {nutrition.calories} kkal (Protein: {nutrition.protein}g)
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Informasi gizi belum tercatat
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-900">
                            {formatPrice(food.price)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFoodItem && (
        <FoodDetail
          food={selectedFoodItem}
          nutrition={getNutritionForFood(selectedFoodItem)}
          restaurant={selectedRestaurant}
          onClose={() => setSelectedFoodItem(null)}
        />
      )}
    </div>
  );
}
