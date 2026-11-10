/**
 * Budget validation and calculation utilities.
 */

const MIN_BUDGET = 5000;
const MAX_BUDGET = 500000;

/**
 * Validate that a budget value is acceptable.
 *
 * @param {*} budget – The raw budget input (may be string, number, etc.).
 * @returns {{ valid: boolean, message: string }}
 */
export function validateBudget(budget) {
  const num = Number(budget);

  if (budget == null || budget === '') {
    return { valid: false, message: 'Budget tidak boleh kosong.' };
  }

  if (!Number.isFinite(num) || num <= 0) {
    return { valid: false, message: 'Budget harus berupa angka positif.' };
  }

  if (num < MIN_BUDGET) {
    return {
      valid: false,
      message: `Budget minimal adalah Rp ${MIN_BUDGET.toLocaleString('id-ID')}.`,
    };
  }

  if (num > MAX_BUDGET) {
    return {
      valid: false,
      message: `Budget maksimal adalah Rp ${MAX_BUDGET.toLocaleString('id-ID')}.`,
    };
  }

  return { valid: true, message: 'Budget valid.' };
}

/**
 * Calculate the remaining budget after spending `totalPrice`.
 *
 * @param {number} budget – Total daily budget in IDR.
 * @param {number} totalPrice – Amount already spent.
 * @returns {number} Remaining budget (may be negative).
 */
export function calculateRemainingBudget(budget, totalPrice) {
  return (budget ?? 0) - (totalPrice ?? 0);
}

/**
 * Format an amount as Indonesian Rupiah, e.g. 25000 → "Rp 25.000".
 */
export function formatBudget(amount) {
  if (amount == null) return 'Rp 0';
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
}

/**
 * Calculate what percentage of the budget has been used.
 *
 * @param {number} budget – Total budget.
 * @param {number} totalPrice – Amount spent.
 * @returns {number} Percentage used (0 – 100+). May exceed 100 if over-budget.
 */
export function getBudgetPercentageUsed(budget, totalPrice) {
  if (!budget || budget <= 0) return 0;
  return ((totalPrice ?? 0) / budget) * 100;
}
