import { STEP_SHEET } from '../../data/constants.js';
import { isSpellcaster } from '../../data/spells.js';

/**
 * Step configuration and management for character creation flow.
 * Handles step navigation, validation, and completion logic.
 */

export const steps = [
  'Abilities',
  'Race',
  'Class',
  'Review',
  'Proficiencies',
  'Equipment',
  'Spells',
  'Backstory',
  'Sheet'
];

/**
 * Creates step field configuration.
 * Each step defines which character fields it manages and what the next step is.
 *
 * @param {Object} character - Character state object
 * @param {Function} saveToLocalStorage - Save function
 * @param {Function} clearMidCreation - Clear WIP function
 * @returns {Object} Step fields configuration
 */
export function createStepFields(character, saveToLocalStorage, clearMidCreation) {
  return {
    0: { fields: ['abilities', 'rollData'], next: 1 },
    1: { fields: ['raceKey', 'race', 'adjustedAbilities'], next: 2 },
    2: { fields: ['classKey', 'cls', 'levelLimit', 'xpBonus', 'wizardSchool', 'deityKey', 'kitKey', 'kit', 'speciesEnemy'], next: 3 },
    4: { fields: ['proficiencies'], next: 5 },
    5: {
      fields: ['equipment'],
      get next() {
        return isSpellcaster(character.classKey) ? 6 : 7;
      },
      after() {
        if (!isSpellcaster(character.classKey)) character.spells = [];
      }
    },
    6: { fields: ['spells'], next: 7 },
    7: {
      fields: ['name', 'sex', 'alignment', 'backstory', 'age', 'heightInches', 'weightLbs', 'eyes', 'hair', 'deity'],
      next: STEP_SHEET,
      after() {
        saveToLocalStorage();
        clearMidCreation();
      }
    },
  };
}

/**
 * Creates step gate functions.
 * Each gate returns true when the step's data is complete.
 *
 * @param {Object} character - Character state object
 * @returns {Array<Function>} Array of gate functions
 */
export function createStepGates(character) {
  return [
    () => character.abilities !== null,   // 0 Roll Abilities
    () => character.race !== null,         // 1 Choose Race
    () => character.cls !== null,          // 2 Choose Class
    () => true,                            // 3 Review (no completion needed)
    () => character.proficiencies !== null, // 4 Proficiencies
    () => character.equipment !== null,     // 5 Equipment
    () => character.spells !== null,        // 6 Spells
    () => character.name !== null,          // 7 Backstory
    () => true,                            // 8 Character Sheet
  ];
}

/**
 * Check if a step is locked (cannot be navigated to).
 * Steps 0-2 (abilities, race, class) are locked once character is level 2+.
 *
 * @param {number} index - Step index
 * @param {Object} character - Character state object
 * @returns {boolean} True if step is locked
 */
export function isStepLocked(index, character) {
  // Steps 0-2 (Abilities, Race, Class) are locked after level 1
  // This prevents changing fundamental character traits after leveling up
  return index <= 2 && (character.level || 1) > 1;
}

/**
 * Check if a step can be navigated to.
 * Can navigate if:
 * - Step is not locked
 * - Step is at or before current step
 * - OR the preceding gate is satisfied
 *
 * @param {number} index - Target step index
 * @param {number} currentStep - Current step index
 * @param {Array<Function>} stepGates - Step gate functions
 * @param {Object} character - Character state object
 * @returns {boolean} True if can navigate to step
 */
export function canNavigateToStep(index, currentStep, stepGates, character) {
  if (isStepLocked(index, character)) return false;
  if (index <= currentStep) return true;

  // Can jump forward only if preceding gate satisfied
  // Special case: Steps 3 (Review) and 4 (Proficiencies) both require class selection (gate 2)
  // This allows skipping the Review step if class is already selected
  const gateIndex = index === 3 || index === 4 ? 2 : index - 1;
  return gateIndex >= 0 && stepGates[gateIndex]();
}

/**
 * Check if a step is incomplete (gate not satisfied).
 *
 * @param {number} index - Step index
 * @param {Array<Function>} stepGates - Step gate functions
 * @returns {boolean} True if step is incomplete
 */
export function isStepIncomplete(index, stepGates) {
  return !stepGates[index]();
}

/**
 * Complete a step and move to the next one.
 * Handles special cases for abilities and class selection.
 *
 * @param {number} step - Current step index
 * @param {Object} data - Step data to save
 * @param {Object} character - Character state object
 * @param {Object} stepFields - Step fields configuration
 * @param {Function} makeEmptyCharacter - Factory function for empty character
 * @returns {number} Next step index
 */
export function completeStep(step, data, character, stepFields, makeEmptyCharacter) {
  // STEP 0 SPECIAL CASE: Ability score changes invalidate everything downstream
  // Why: Race/class availability depends on ability scores. If scores change,
  // the user's previous race/class choices might now be invalid.
  // Example: If STR drops from 18 to 12, Paladin (requires STR 12+, WIS 13+, CHA 17+)
  // might become unavailable, so we need to clear race/class selections.
  if (step === 0 && character.abilities) {
    const a = character.abilities, b = data.abilities;
    // Check if ANY ability score changed (including exceptional strength for warriors)
    const changed = a.STR !== b.STR || a.DEX !== b.DEX || a.CON !== b.CON ||
      a.INT !== b.INT || a.WIS !== b.WIS || a.CHA !== b.CHA ||
      a.exceptionalStr !== b.exceptionalStr;

    if (changed) {
      // Reset character to fresh state, but preserve the new abilities and roll data
      const empty = makeEmptyCharacter();
      const keepFields = ['abilities', 'rollData'];
      for (const key of Object.keys(empty)) {
        if (!keepFields.includes(key)) character[key] = empty[key];
      }
    }
  }

  // STEP 2 SPECIAL CASE: Exceptional strength from class selection
  // Why: Warriors with 18 STR roll d100 for exceptional strength (18/01 to 18/00).
  // The ClassSelector component determines if exceptional STR applies and what it is.
  // We store it in abilities so it's available throughout the app.
  if (step === 2 && data.exceptionalStr !== undefined) {
    if (!character.abilities) character.abilities = {};
    character.abilities.exceptionalStr = data.exceptionalStr;
  }

  const config = stepFields[step];
  for (const field of config.fields) {
    character[field] = data[field] ?? null;
  }
  const nextStep = config.next;
  config.after?.();

  return nextStep;
}
