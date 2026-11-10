/**
 * Nutrition calculation and formatting utilities.
 */

/**
 * Aggregate nutrition values across an array of food objects.
 *
 * For each standard nutrition field, the function sums the values obtained
 * by calling `getNutritionFn(food)`. Fields that are `null` in every food
 * remain `null` in the result (they are NOT treated as zero).
 *
 * @param {Array} foods – Array of food objects.
 * @param {Function} getNutritionFn – `(food) => nutritionRecord | null`.
 * @returns {Object} Aggregated nutrition summary.
 */
export function aggregateNutrition(foods, getNutritionFn) {
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

    for (const food of foods) {
      const rec = getNutritionFn(food);
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

/**
 * Format a calorie value for display, e.g. "350 kkal".
 * Returns "N/A" when the value is null / undefined.
 */
export function formatCalories(val) {
  if (val == null) return 'N/A';
  return `${Math.round(val)} kkal`;
}

/**
 * Format a gram-based nutrition value for display, e.g. "12,5 g".
 * Returns "N/A" when the value is null / undefined.
 */
export function formatGrams(val) {
  if (val == null) return 'N/A';
  // Use one decimal place and Indonesian decimal separator
  const formatted = Number(val).toFixed(1).replace('.', ',');
  return `${formatted} g`;
}

/**
 * Calculate the ratio (0 – 1) of foods in the array that have complete
 * nutrition data (i.e. `getNutritionFn(food)` returns a non-null record).
 *
 * @param {Array} foods – Array of food objects.
 * @param {Function} getNutritionFn – `(food) => nutritionRecord | null`.
 * @returns {number} Completeness ratio between 0 and 1.
 */
export function getNutritionCompleteness(foods, getNutritionFn) {
  if (!foods || foods.length === 0) return 0;
  const withData = foods.filter((f) => getNutritionFn(f) !== null).length;
  return withData / foods.length;
}

/**
 * Format a price in Indonesian Rupiah, e.g. 15000 → "Rp 15.000".
 */
export function formatPrice(price) {
  if (price == null) return 'N/A';
  return `Rp ${Number(price).toLocaleString('id-ID')}`;
}
