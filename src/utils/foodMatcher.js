/**
 * Food name matching utilities for the AI food scanner.
 *
 * Given a food name returned by the Gemini vision model, we attempt to match
 * it against the local nutrition database using aliases and fuzzy matching.
 */

import nutrition from '../data/nutrition.json';
import aliases from '../data/aliases.json';

// ============================================================
// Text normalisation
// ============================================================

/**
 * Normalise a text string for comparison:
 * - lowercase
 * - trim whitespace
 * - collapse multiple spaces
 * - strip common diacritical marks / accents
 *
 * @param {string} text
 * @returns {string} Normalised text.
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ============================================================
// Matching helpers
// ============================================================

/**
 * Attempt to find a nutrition record that matches the given food name.
 *
 * Strategy (in order):
 *   1. Exact match on nutrition record name
 *   2. "Contains" match on nutrition record name
 *   3. Exact match on any alias entry
 *   4. "Contains" match on any alias entry
 *
 * @param {string} foodName – The food name to look up (e.g. from Gemini).
 * @param {Array}  [nutritionData] – Nutrition dataset (defaults to imported JSON).
 * @param {Array}  [aliasesData]   – Aliases dataset (defaults to imported JSON).
 * @returns {Object|null} The matching nutrition record, or `null`.
 */
export function findNutritionMatch(
  foodName,
  nutritionData = nutrition,
  aliasesData = aliases
) {
  if (!foodName || typeof foodName !== 'string') return null;

  const normInput = normalizeText(foodName);
  if (normInput.length === 0) return null;

  const nutritionArr = Array.isArray(nutritionData) ? nutritionData : [];
  const aliasesArr = Array.isArray(aliasesData) ? aliasesData : [];

  // ----- 1. Exact match on nutrition name -----
  for (const rec of nutritionArr) {
    if (normalizeText(rec.name) === normInput) return rec;
  }

  // ----- 2. Contains match on nutrition name -----
  for (const rec of nutritionArr) {
    const normName = normalizeText(rec.name);
    if (normName.includes(normInput) || normInput.includes(normName)) {
      return rec;
    }
  }

  // ----- 3. Exact match on aliases -----
  for (const entry of aliasesArr) {
    const entryAliases = Array.isArray(entry.aliases) ? entry.aliases : [];
    const allNames = [entry.name, ...entryAliases].filter(Boolean);

    for (const alias of allNames) {
      if (normalizeText(alias) === normInput) {
        // Found alias match → look up the linked nutrition record
        return findNutritionRecordForAlias(entry, nutritionArr);
      }
    }
  }

  // ----- 4. Contains match on aliases -----
  for (const entry of aliasesArr) {
    const entryAliases = Array.isArray(entry.aliases) ? entry.aliases : [];
    const allNames = [entry.name, ...entryAliases].filter(Boolean);

    for (const alias of allNames) {
      const normAlias = normalizeText(alias);
      if (normAlias.includes(normInput) || normInput.includes(normAlias)) {
        return findNutritionRecordForAlias(entry, nutritionArr);
      }
    }
  }

  return null;
}

/**
 * Given an alias entry, resolve the linked nutrition record.
 * The alias entry may have a `nutritionId` or `id` field that maps to
 * a nutrition record.
 */
function findNutritionRecordForAlias(aliasEntry, nutritionArr) {
  if (!aliasEntry) return null;

  // Try nutritionId first, then id
  const lookupId = aliasEntry.nutritionId ?? aliasEntry.id;
  if (lookupId != null) {
    const rec = nutritionArr.find((n) => n.id === lookupId);
    if (rec) return rec;
  }

  // Fallback: match by the alias entry's canonical name
  const normName = normalizeText(aliasEntry.name);
  if (normName) {
    for (const rec of nutritionArr) {
      if (normalizeText(rec.name) === normName) return rec;
    }
    for (const rec of nutritionArr) {
      const rn = normalizeText(rec.name);
      if (rn.includes(normName) || normName.includes(rn)) return rec;
    }
  }

  return null;
}

// ============================================================
// Best match across multiple candidates
// ============================================================

/**
 * Given an array of candidate food names (e.g. multiple guesses from the
 * AI model), try to match each one and return the best result.
 *
 * @param {string[]} candidates – Ordered list of candidate food names.
 * @param {Array}    [nutritionData] – Nutrition dataset.
 * @param {Array}    [aliasesData]   – Aliases dataset.
 * @returns {{ name: string, nutrition: Object } | null}
 *   The first successful match with its nutrition data, or `null` if none
 *   matched.
 */
export function findBestMatch(
  candidates,
  nutritionData = nutrition,
  aliasesData = aliases
) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  for (const name of candidates) {
    const match = findNutritionMatch(name, nutritionData, aliasesData);
    if (match) {
      return { name, nutrition: match };
    }
  }

  return null;
}
