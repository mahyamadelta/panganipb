import {
  getAvailableFoods,
  getNutritionForFood,
} from './foodService';

// ============================================================
// Helpers – meal-type filtered available foods
// ============================================================

/**
 * Returns available foods (valid price, not unavailable) for a specific
 * meal type ("breakfast", "lunch", or "dinner").
 */
export function getAvailableFoodsByMealType(mealType) {
  if (!mealType || typeof mealType !== 'string') return [];
  const mt = mealType.trim().toLowerCase();
  return getAvailableFoods().filter(
    (f) => f.mealType && f.mealType.toLowerCase() === mt
  );
}

// ============================================================
// Price / Nutrition aggregation
// ============================================================

/**
 * Sum the prices of a combination's foods.
 * combination = { breakfast, lunch, dinner }
 */
export function calculateTotalPrice(combination) {
  const { breakfast, lunch, dinner } = combination;
  return (breakfast?.price ?? 0) + (lunch?.price ?? 0) + (dinner?.price ?? 0);
}

/**
 * Aggregate nutrition across the three meals.
 * If ALL meals are missing nutrition data for a field, the field is `null`.
 * If at least one meal has the value, nulls from other meals stay null (they
 * are NOT treated as 0).
 */
export function calculateNutritionSummary(combination) {
  const meals = [combination.breakfast, combination.lunch, combination.dinner];
  const nutritionRecords = meals.map((f) => (f ? getNutritionForFood(f) : null));

  const fields = [
    'calories',
    'protein',
    'fat',
    'carbohydrates',
    'fiber',
    'sugar',
    'sodium',
  ];

  const summary = {};
  for (const field of fields) {
    let allNull = true;
    let total = null;
    for (const rec of nutritionRecords) {
      const val = rec ? rec[field] : null;
      if (val != null && typeof val === 'number') {
        allNull = false;
        total = (total ?? 0) + val;
      }
    }
    summary[field] = allNull ? null : total;
  }

  return summary;
}

// ============================================================
// Scoring functions
// ============================================================

/**
 * Budget score: 100 × (1 − totalPrice / budget), clamped to [0, 100].
 * Higher = more budget remaining.
 */
export function calculateBudgetScore(combination, budget) {
  const totalPrice = calculateTotalPrice(combination);
  if (!budget || budget <= 0) return 0;
  const raw = 100 * (1 - totalPrice / budget);
  return Math.max(0, Math.min(100, raw));
}

/**
 * Nutrition score (0–100) based on:
 *   - Protein presence (25 pts)  → any meal has protein > 5 g
 *   - Vegetable / fiber presence (25 pts) → any meal has fiber > 2 g OR food
 *     name / category hints at vegetables
 *   - Variety of food groups (25 pts) → number of distinct food categories
 *   - Nutrition data completeness (25 pts) → ratio of meals with nutrition data
 */
export function calculateNutritionScore(combination) {
  const meals = [combination.breakfast, combination.lunch, combination.dinner].filter(Boolean);
  if (meals.length === 0) return 0;

  let score = 0;

  // --- Protein presence (25 pts) ---
  const hasProtein = meals.some((f) => {
    const n = getNutritionForFood(f);
    return n && n.protein != null && n.protein > 5;
  });
  if (hasProtein) score += 25;

  // --- Vegetable / fiber presence (25 pts) ---
  const veggieKeywords = [
    'sayur', 'vegetable', 'salad', 'sop', 'sup', 'bayam', 'kangkung',
    'terong', 'lalapan', 'gado', 'pecel', 'urap', 'capcay', 'tumis',
  ];
  const hasFiber = meals.some((f) => {
    const n = getNutritionForFood(f);
    if (n && n.fiber != null && n.fiber > 2) return true;
    // Fallback: check food name / category for veggie keywords
    const nameLC = (f.name || '').toLowerCase();
    const catLC = (f.category || '').toLowerCase();
    return veggieKeywords.some((kw) => nameLC.includes(kw) || catLC.includes(kw));
  });
  if (hasFiber) score += 25;

  // --- Variety of food groups (25 pts) ---
  const categories = new Set();
  meals.forEach((f) => {
    if (f.category) categories.add(f.category.toLowerCase());
  });
  // Award proportionally: 1 category = 8, 2 = 17, 3+ = 25
  const catCount = categories.size;
  if (catCount >= 3) {
    score += 25;
  } else if (catCount === 2) {
    score += 17;
  } else if (catCount === 1) {
    score += 8;
  }

  // --- Nutrition data completeness (25 pts) ---
  const mealsWithNutrition = meals.filter((f) => getNutritionForFood(f) !== null).length;
  score += 25 * (mealsWithNutrition / meals.length);

  return Math.round(score * 100) / 100;
}

/**
 * Variety score (0–100):
 *   - Different restaurants  (33 pts)
 *   - Different food categories (33 pts)
 *   - No repeated food names  (34 pts)
 */
export function calculateVarietyScore(combination) {
  const meals = [combination.breakfast, combination.lunch, combination.dinner].filter(Boolean);
  if (meals.length === 0) return 0;

  let score = 0;

  // --- Different restaurants (33 pts) ---
  const restaurantIds = new Set(meals.map((f) => f.restaurantId).filter(Boolean));
  if (restaurantIds.size >= 3) {
    score += 33;
  } else if (restaurantIds.size === 2) {
    score += 22;
  } else if (restaurantIds.size === 1) {
    score += 11;
  }

  // --- Different food categories (33 pts) ---
  const categories = new Set(
    meals.map((f) => (f.category || '').toLowerCase()).filter(Boolean)
  );
  if (categories.size >= 3) {
    score += 33;
  } else if (categories.size === 2) {
    score += 22;
  } else if (categories.size === 1) {
    score += 11;
  }

  // --- No repeated food names (34 pts) ---
  const names = meals.map((f) => (f.name || '').toLowerCase().trim());
  const uniqueNames = new Set(names);
  if (uniqueNames.size === meals.length) {
    score += 34;
  } else {
    // Partial credit based on uniqueness ratio
    score += Math.round(34 * (uniqueNames.size / meals.length));
  }

  return score;
}

/**
 * Final composite score:
 *   40% budget  +  40% nutrition  +  20% variety
 */
export function calculateFinalScore(combination, budget) {
  const budgetScore = calculateBudgetScore(combination, budget);
  const nutritionScore = calculateNutritionScore(combination);
  const varietyScore = calculateVarietyScore(combination);

  return Math.round(
    (0.4 * budgetScore + 0.4 * nutritionScore + 0.2 * varietyScore) * 100
  ) / 100;
}

// ============================================================
// Combination generation
// ============================================================

/**
 * Generate all valid breakfast + lunch + dinner combinations that fit
 * within the given budget. Returns at most 50 combinations sorted by
 * descending final score.
 */
export function generateMealCombinations(budget) {
  const breakfastOptions = getAvailableFoodsByMealType('breakfast');
  const lunchOptions = getAvailableFoodsByMealType('lunch');
  const dinnerOptions = getAvailableFoodsByMealType('dinner');

  const combinations = [];

  for (const b of breakfastOptions) {
    // Early exit: if breakfast alone exceeds budget, skip
    if (b.price >= budget) continue;

    for (const l of lunchOptions) {
      const bLPrice = b.price + l.price;
      if (bLPrice >= budget) continue;

      for (const d of dinnerOptions) {
        const total = bLPrice + d.price;
        if (total <= budget) {
          const combo = { breakfast: b, lunch: l, dinner: d };
          combinations.push(combo);
        }
      }
    }
  }

  // Score and sort; keep top 50
  const scored = combinations.map((combo) => ({
    ...combo,
    totalPrice: calculateTotalPrice(combo),
    finalScore: calculateFinalScore(combo, budget),
  }));

  scored.sort((a, b) => b.finalScore - a.finalScore);

  return scored.slice(0, 50);
}

/**
 * Rank an array of combinations by their final score (descending).
 */
export function rankRecommendations(combinations, budget) {
  return [...combinations]
    .map((combo) => ({
      ...combo,
      totalPrice: calculateTotalPrice(combo),
      budgetScore: calculateBudgetScore(combo, budget),
      nutritionScore: calculateNutritionScore(combo),
      varietyScore: calculateVarietyScore(combo),
      finalScore: calculateFinalScore(combo, budget),
    }))
    .sort((a, b) => b.finalScore - a.finalScore);
}

// ============================================================
// Main entry point
// ============================================================

/**
 * Given a daily food budget (in IDR), return the top 5 recommended
 * breakfast + lunch + dinner combinations.
 *
 * Returns { success, recommendations, message }.
 */
export function getRecommendations(budget) {
  // --- Validate budget ---
  const numBudget = Number(budget);
  if (!Number.isFinite(numBudget) || numBudget <= 0) {
    return {
      success: false,
      recommendations: [],
      message: 'Budget harus berupa angka positif.',
    };
  }
  if (numBudget < 5000) {
    return {
      success: false,
      recommendations: [],
      message: 'Budget minimal adalah Rp 5.000.',
    };
  }
  if (numBudget > 500000) {
    return {
      success: false,
      recommendations: [],
      message: 'Budget maksimal adalah Rp 500.000.',
    };
  }

  // --- Generate & rank ---
  const combos = generateMealCombinations(numBudget);

  if (combos.length === 0) {
    return {
      success: false,
      recommendations: [],
      message:
        'Tidak ditemukan kombinasi makanan yang sesuai dengan budget Anda. Coba tingkatkan budget.',
    };
  }

  const ranked = rankRecommendations(combos, numBudget);

  return {
    success: true,
    recommendations: ranked.slice(0, 5),
    message: `Ditemukan ${Math.min(ranked.length, 5)} rekomendasi terbaik.`,
  };
}
