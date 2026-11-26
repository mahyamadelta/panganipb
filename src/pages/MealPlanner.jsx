import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  AlertCircle,
  Award,
  TrendingUp,
  Layers,
  Heart,
  Wallet,
} from 'lucide-react';
import BudgetInput from '../components/planner/BudgetInput';
import MealCard from '../components/planner/MealCard';
import BudgetSummary from '../components/planner/BudgetSummary';
import {
  getRecommendations,
  calculateNutritionSummary,
  generateTwoMealCombinations,
} from '../services/recommendationService';
import { getRestaurantById, getNutritionForFood } from '../services/foodService';

export default function MealPlanner() {
  const [currentBudget, setCurrentBudget] = useState(25000);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [mealMode, setMealMode] = useState('3'); // '3' or '2'

  // Reset selection and rebuild when mode changes
  useEffect(() => {
    if (hasSearched) handleSearchBudget(currentBudget);
  }, [mealMode]);

  const handleSearchBudget = (budget) => {
    setIsLoading(true);
    setErrorMessage('');
    setCurrentBudget(budget);
    setHasSearched(true);

    setTimeout(() => {
      let res;
      if (mealMode === '2') {
        res = generateTwoMealCombinations(budget);
        // normalize to same shape as 3-meal recommendations
        res = res.map((c) => ({ ...c, breakfast: null }));
      } else {
        res = getRecommendations(budget);
        res = res.recommendations ?? [];
      }

      if (res.length > 0) {
        setRecommendations(res);
        setSelectedIndex(0);
        setErrorMessage('');
      } else {
        setRecommendations([]);
        const label = mealMode === '2' ? '2' : '3';
        setErrorMessage(
          `Tidak ditemukan kombinasi ${label} kali makan dalam budget Rp ${budget.toLocaleString('id-ID')}. Coba naikkan sedikit budget harian.`
        );
      }
      setIsLoading(false);
    }, 250);
  };

  const activePlan = recommendations[selectedIndex] || null;
  const activePlanNutrition = activePlan
    ? calculateNutritionSummary(activePlan)
    : null;

  const modeLabel = mealMode === '3' ? '3 Waktu Makan' : '2 Waktu Makan';
  const modeDesc =
    mealMode === '3'
      ? 'Dapatkan kombinasi 3 waktu makan (Sarapan, Siang, & Malam) yang tidak melebihi anggaran Anda dengan gizi optimal.'
      : 'Dapatkan kombinasi 2 waktu makan (Siang + Malam) yang pas dan bergizi sesuai anggaran Anda.';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
          Rekomendasi Menu Harian Seimbang
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">{modeDesc}</p>
      </div>

      {/* Meal Mode Toggle */}
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-1.5 w-fit">
        <button
          type="button"
          onClick={() => setMealMode('3')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
            mealMode === '3'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          🍽️ 3 Kali Makan
        </button>
        <button
          type="button"
          onClick={() => setMealMode('2')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
            mealMode === '2'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          🥣 2 Kali Makan
        </button>
      </div>

      {/* Budget Form */}
      <BudgetInput
        onSubmit={handleSearchBudget}
        isLoading={isLoading}
        initialBudget={currentBudget}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-600 animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-800 text-base">
            Mengkalkulasi Kombinasi Terbaik...
          </p>
          <p className="text-xs text-slate-500">
            Mengevaluasi harga, variasi menu, dan kandungan gizi dari menu survei.
          </p>
        </div>
      ) : errorMessage ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">
            Belum Ada Kombinasi yang Pas
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {errorMessage}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                const next = currentBudget + 5000;
                setMealMode(mealMode); // keep mode
                handleSearchBudget(next);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Coba Budget Naik Rp 5.000
            </button>
          </div>
        </div>
      ) : activePlan ? (
        <div className="space-y-5">
          {/* Recommendation Tabs (Top 5 Alternatives) */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {recommendations.map((rec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    selectedIndex === idx
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-700/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Rekomendasi #{idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Score Indicators */}
            <div className="hidden sm:flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <Sparkles className="w-3.5 h-3.5" />
                Skor: {Math.round(activePlan.finalScore)}/100
              </span>
              <span className="text-slate-300">|</span>
              <span title="Efisiensi Budget">
                Budget: {Math.round(activePlan.budgetScore || 0)}
              </span>
              <span title="Keseimbangan Gizi">
                Gizi: {Math.round(activePlan.nutritionScore || 0)}
              </span>
              <span title="Variasi Menu">
                Variasi: {Math.round(activePlan.varietyScore || 0)}
              </span>
            </div>
          </div>

          {/* Meal Cards Grid — adapts to mode */}
          {mealMode === '2' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MealCard
                meal={activePlan.lunch}
                mealType="lunch"
                nutrition={activePlan?.lunch ? getNutritionForFood(activePlan.lunch) : null}
                restaurant={activePlan?.lunch ? getRestaurantById(activePlan.lunch.restaurantId) : null}
              />
              <MealCard
                meal={activePlan.dinner}
                mealType="dinner"
                nutrition={activePlan?.dinner ? getNutritionForFood(activePlan.dinner) : null}
                restaurant={activePlan?.dinner ? getRestaurantById(activePlan.dinner.restaurantId) : null}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MealCard
                meal={activePlan.breakfast}
                mealType="breakfast"
                nutrition={getNutritionForFood(activePlan.breakfast)}
                restaurant={getRestaurantById(activePlan.breakfast?.restaurantId)}
              />
              <MealCard
                meal={activePlan.lunch}
                mealType="lunch"
                nutrition={getNutritionForFood(activePlan.lunch)}
                restaurant={getRestaurantById(activePlan.lunch?.restaurantId)}
              />
              <MealCard
                meal={activePlan.dinner}
                mealType="dinner"
                nutrition={getNutritionForFood(activePlan.dinner)}
                restaurant={getRestaurantById(activePlan.dinner?.restaurantId)}
              />
            </div>
          )}

          {/* Budget & Nutrition Summary */}
          <BudgetSummary
            combination={activePlan}
            budget={currentBudget}
            nutritionSummary={activePlanNutrition}
          />
        </div>
      ) : null}
    </div>
  );
}
