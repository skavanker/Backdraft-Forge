/**
 * State Management Utilities
 * Reusable composables for common state patterns using Svelte 5 runes
 */

import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers
} from '../../data/mechanics.js';
import { getClassGroup, isWarrior } from './characterAccessors.js';

/**
 * Toggle utility - manages boolean state with helper functions
 * @param {boolean} initialValue - Initial state value
 * @returns {{ value: boolean, toggle: Function, open: Function, close: Function, set: Function }}
 */
export function useToggle(initialValue = false) {
  let value = $state(initialValue);

  return {
    get value() { return value; },
    set value(newValue) { value = newValue; },
    toggle: () => { value = !value; },
    open: () => { value = true; },
    close: () => { value = false; },
    set: (newValue) => { value = newValue; }
  };
}

/**
 * Edit mode utility - manages inline editing state with input value
 * @param {any} initialValue - Initial value
 * @returns {{ editing: boolean, value: any, inputValue: any, startEdit: Function, endEdit: Function, cancelEdit: Function, setValue: Function }}
 */
export function useEditMode(initialValue) {
  let editing = $state(false);
  let value = $state(initialValue);
  let inputValue = $state(String(initialValue));

  return {
    get editing() { return editing; },
    get value() { return value; },
    get inputValue() { return inputValue; },
    set inputValue(newValue) { inputValue = newValue; },

    startEdit: () => {
      inputValue = String(value);
      editing = true;
    },

    endEdit: (newValue) => {
      if (newValue !== undefined) {
        value = newValue;
      }
      editing = false;
    },

    cancelEdit: () => {
      editing = false;
    },

    setValue: (newValue) => {
      value = newValue;
      inputValue = String(newValue);
    }
  };
}

/**
 * Selection manager - manages array-based selection state with slot/cost validation
 * @param {object} options - Configuration options
 * @param {number} options.maxSlots - Maximum number of slots available
 * @param {Function} options.getCost - Function to get cost of an item (default: 1)
 * @param {Array} options.initialSelection - Initial selected items
 * @param {Array} options.lockedItems - Items that cannot be deselected
 * @returns {{ selected: Array, toggle: Function, isSelected: Function, canSelect: Function, slotsUsed: number, slotsRemaining: number, isLocked: Function }}
 */
export function useSelection(options = {}) {
  const {
    maxSlots = Infinity,
    getCost = () => 1,
    initialSelection = [],
    lockedItems = []
  } = options;

  let selected = $state([...initialSelection]);
  let locked = $state([...lockedItems]);

  const slotsUsed = $derived(
    selected.reduce((sum, item) => sum + getCost(item), 0)
  );

  const slotsRemaining = $derived(maxSlots - slotsUsed);

  return {
    get selected() { return selected; },
    set selected(newSelection) { selected = newSelection; },

    get locked() { return locked; },
    set locked(newLocked) { locked = newLocked; },

    get slotsUsed() { return slotsUsed; },
    get slotsRemaining() { return slotsRemaining; },

    isSelected: (item, keyField = 'key') => {
      return selected.some(s => s[keyField] === item[keyField]);
    },

    isLocked: (item, keyField = 'key') => {
      return locked.some(l => l[keyField] === item[keyField]);
    },

    canSelect: (item) => {
      const cost = getCost(item);
      return slotsRemaining >= cost;
    },

    toggle: (item, keyField = 'key') => {
      const isLocked = locked.some(l => l[keyField] === item[keyField]);
      if (isLocked) return false;

      const index = selected.findIndex(s => s[keyField] === item[keyField]);

      if (index >= 0) {
        // Deselect
        selected = selected.filter((_, i) => i !== index);
        return false;
      } else {
        // Try to select
        const cost = getCost(item);
        if (slotsRemaining >= cost) {
          selected = [...selected, item];
          return true;
        }
        return false;
      }
    },

    add: (item) => {
      const cost = getCost(item);
      if (slotsRemaining >= cost) {
        selected = [...selected, item];
        return true;
      }
      return false;
    },

    remove: (item, keyField = 'key') => {
      const isLocked = locked.some(l => l[keyField] === item[keyField]);
      if (isLocked) return false;

      selected = selected.filter(s => s[keyField] !== item[keyField]);
      return true;
    },

    clear: () => {
      selected = locked.length > 0 ? [...locked] : [];
    },

    reset: () => {
      selected = [...initialSelection];
    }
  };
}

/**
 * Toast composable — flash a message for a given duration.
 * @param {number} defaultDuration - default duration in ms (default 1500)
 * @returns {{ message: string, visible: boolean, flash: Function }}
 */
export function useToast(defaultDuration = 1500) {
  let message = $state('');
  let visible = $state(false);
  let timer;

  return {
    get message() { return message; },
    get visible() { return visible; },
    flash(msg, duration = defaultDuration) {
      message = msg;
      visible = true;
      clearTimeout(timer);
      timer = setTimeout(() => { visible = false; }, duration);
    }
  };
}

/**
 * Copy feedback utility - manages per-item copy indicator with auto-reset
 * @param {number} duration - Auto-reset duration in ms
 * @returns {{ activeIndex: number, isError: boolean, flash: Function }}
 */
export function useCopyFeedback(duration = 2000) {
  let activeIndex = $state(-1);
  let isError = $state(false);
  let timer;

  return {
    get activeIndex() { return activeIndex; },
    get isError() { return isError; },
    flash(index, error = false) {
      activeIndex = index;
      isError = error;
      clearTimeout(timer);
      timer = setTimeout(() => { activeIndex = -1; isError = false; }, duration);
    }
  };
}

/**
 * Ability modifiers utility - calculates all ability score modifiers
 * @param {object} character - Character object with abilities and class info
 * @returns {{ str: object, dex: object, con: object, int: object, wis: object, cha: object }}
 */
export function useAbilityModifiers(character) {
  const str = $derived(getStrengthModifiers(
    character.adjustedAbilities.STR,
    isWarrior(character) ? character.abilities.exceptionalStr : null
  ));
  const dex = $derived(getDexterityModifiers(character.adjustedAbilities.DEX));
  const con = $derived(getConstitutionModifiers(character.adjustedAbilities.CON, getClassGroup(character)));
  const int = $derived(getIntelligenceModifiers(character.adjustedAbilities.INT));
  const wis = $derived(getWisdomModifiers(character.adjustedAbilities.WIS));
  const cha = $derived(getCharismaModifiers(character.adjustedAbilities.CHA));

  return {
    get str() { return str; },
    get dex() { return dex; },
    get con() { return con; },
    get int() { return int; },
    get wis() { return wis; },
    get cha() { return cha; }
  };
}
