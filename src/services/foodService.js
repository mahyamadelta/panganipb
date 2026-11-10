import restaurants from '../data/restaurants.json';
import foods from '../data/foods.json';
import nutrition from '../data/nutrition.json';

// ============================================================
// Restaurant Queries
// ============================================================

/**
 * Returns every restaurant record.
 */
export function getAllRestaurants() {
  return restaurants ?? [];
}

/**
 * Returns a single restaurant by its `id` field, or `null` if not found.
 */
export function getRestaurantById(id) {
  if (id == null) return null;
  return restaurants.find((r) => r.id === id) ?? null;
}

/**
 * Search restaurants whose name contains the query string (case-insensitive).
 */
export function searchRestaurants(query) {
  if (!query || typeof query !== 'string') return getAllRestaurants();
  const q = query.trim().toLowerCase();
  if (q.length === 0) return getAllRestaurants();
  return restaurants.filter(
    (r) => r.name && r.name.toLowerCase().includes(q)
  );
}

/**
 * Filter restaurants by optional category and/or mealType.
 * Both filters are case-insensitive. If a filter key is falsy it is ignored.
 */
export function filterRestaurants({ category, mealType } = {}) {
  let result = getAllRestaurants();

  if (category && typeof category === 'string') {
    const cat = category.trim().toLowerCase();
    result = result.filter(
      (r) => r.category && r.category.toLowerCase() === cat
    );
  }

  if (mealType && typeof mealType === 'string') {
    const mt = mealType.trim().toLowerCase();
    result = result.filter((r) => {
      // A restaurant supports a mealType if it has a matching field or
      // if any of its foods match the meal type.
      if (r.mealTypes && Array.isArray(r.mealTypes)) {
        return r.mealTypes.some((m) => m.toLowerCase() === mt);
      }
      // Fallback: check foods belonging to this restaurant
      const rFoods = getFoodsByRestaurant(r.id);
      return rFoods.some(
        (f) => f.mealType && f.mealType.toLowerCase() === mt
      );
    });
  }

  return result;
}

/**
 * Returns all unique restaurant categories as a sorted array of strings.
 */
export function getUniqueCategories() {
  const cats = new Set();
  restaurants.forEach((r) => {
    if (r.category) cats.add(r.category);
  });
  return [...cats].sort();
}

// ============================================================
// Food Queries
// ============================================================

/**
 * Returns every food record.
 */
export function getAllFoods() {
  return foods ?? [];
}

/**
 * Returns a single food by its `id` field, or `null` if not found.
 */
export function getFoodById(id) {
  if (id == null) return null;
  return foods.find((f) => f.id === id) ?? null;
}

/**
 * Returns all foods that belong to a given restaurant (by restaurantId).
 */
export function getFoodsByRestaurant(restaurantId) {
  if (restaurantId == null) return [];
  return foods.filter((f) => f.restaurantId === restaurantId);
}

/**
 * Returns all foods matching a given meal type (case-insensitive).
 * Common values: "breakfast", "lunch", "dinner".
 */
export function getFoodsByMealType(mealType) {
  if (!mealType || typeof mealType !== 'string') return [];
  const mt = mealType.trim().toLowerCase();
  return foods.filter(
    (f) => f.mealType && f.mealType.toLowerCase() === mt
  );
}

/**
 * Returns only foods that are marked available and have a valid (positive
 * numeric) price.
 */
export function getAvailableFoods() {
  return foods.filter((f) => {
    const hasValidPrice =
      f.price != null && typeof f.price === 'number' && f.price > 0;
    // If the data includes an `available` flag, respect it; otherwise assume
    // available when the price is valid.
    const isAvailable = f.available !== false;
    return hasValidPrice && isAvailable;
  });
}

/**
 * Search foods whose name contains the query string (case-insensitive).
 */
export function searchFoods(query) {
  if (!query || typeof query !== 'string') return getAllFoods();
  const q = query.trim().toLowerCase();
  if (q.length === 0) return getAllFoods();
  return foods.filter((f) => f.name && f.name.toLowerCase().includes(q));
}

// ============================================================
// Nutrition Queries
// ============================================================

/**
 * Returns a single nutrition record by its `id`, or `null` if not found.
 */
export function getNutritionById(id) {
  if (id == null) return null;
  return nutrition.find((n) => n.id === id) ?? null;
}

/**
 * Returns the nutrition record linked to a food item (via food.nutritionId).
 * Returns `null` if the food has no `nutritionId` or the record doesn't exist.
 */
export function getNutritionForFood(food) {
  if (!food || food.nutritionId == null) return null;
  return getNutritionById(food.nutritionId);
}
