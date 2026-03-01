/**
 * Gold ledger composable for EquipmentSelector.
 * Manages gold state with buy/sell/afford operations.
 */
import { priceToGp } from '../../data/equipment.js';

/**
 * Create a gold ledger composable for managing character gold.
 * Provides reactive state and operations for buy/sell/afford checks.
 *
 * @returns {Object} Gold ledger object
 * @returns {number|null} return.gold - Current gold amount in gp
 * @returns {boolean} return.goldRolled - Whether starting gold has been rolled
 * @returns {number[]} return.goldDice - Individual dice rolled for starting gold
 * @returns {string} return.goldDiceFormula - Dice formula used (e.g., "3d6×10")
 * @returns {number} return.goldDieSize - Size of dice used for gold roll
 * @returns {Function} return.canAfford - Check if price is affordable
 * @returns {Function} return.deduct - Deduct gold amount
 * @returns {Function} return.refund - Refund gold amount
 * @returns {Function} return.deductPrice - Deduct using price object
 * @returns {Function} return.refundPrice - Refund using price object
 * @returns {Function} return.setFromRoll - Set gold from roll result
 * @returns {Function} return.reset - Reset all gold state
 * @returns {Function} return.restore - Restore from saved equipment data
 */
export function useGoldLedger() {
  let gold = $state(null);
  let goldRolled = $state(false);
  let goldDice = $state([]);
  let goldDiceFormula = $state('');
  let goldDieSize = $state(6);

  return {
    get gold() { return gold; },
    set gold(v) { gold = v; },
    get goldRolled() { return goldRolled; },
    set goldRolled(v) { goldRolled = v; },
    get goldDice() { return goldDice; },
    set goldDice(v) { goldDice = v; },
    get goldDiceFormula() { return goldDiceFormula; },
    set goldDiceFormula(v) { goldDiceFormula = v; },
    get goldDieSize() { return goldDieSize; },
    set goldDieSize(v) { goldDieSize = v; },

    /** Check if the player can afford a price object */
    canAfford(price) {
      if (gold === null) return false;
      return gold >= priceToGp(price);
    },

    /** Deduct a gp amount from gold */
    deduct(amount) {
      gold -= amount;
    },

    /** Refund a gp amount to gold */
    refund(amount) {
      gold += amount;
    },

    /** Deduct using a price object */
    deductPrice(price) {
      gold -= priceToGp(price);
    },

    /** Refund using a price object */
    refundPrice(price) {
      gold += priceToGp(price);
    },

    /** Set gold from a roll result */
    setFromRoll(result) {
      gold = result.gold;
      goldDice = result.dice;
      goldDiceFormula = result.diceFormula;
      goldDieSize = result.dieSize || 6;
      goldRolled = true;
    },

    /** Reset all gold state */
    reset() {
      gold = null;
      goldRolled = false;
      goldDice = [];
      goldDiceFormula = '';
      goldDieSize = 6;
    },

    /** Restore from saved equipment data */
    restore(existingEquipment) {
      // Support new gp/sp/cp schema or fallback to old decimal remaining
      if (existingEquipment.gp !== undefined || existingEquipment.sp !== undefined || existingEquipment.cp !== undefined) {
        const gp = existingEquipment.gp || 0;
        const sp = existingEquipment.sp || 0;
        const cp = existingEquipment.cp || 0;
        gold = gp + (sp / 10) + (cp / 100);
      } else {
        gold = existingEquipment.remaining ?? existingEquipment.gold ?? 0;
      }
      goldRolled = true;
      goldDice = existingEquipment.goldDice || [];
      goldDiceFormula = existingEquipment.goldDiceFormula || '';
      goldDieSize = existingEquipment.goldDieSize || 6;
    },

    /** Convert current gold to gp/sp/cp breakdown */
    toCoins() {
      if (gold === null) return { gp: 0, sp: 0, cp: 0 };

      // Convert decimal gold to coins
      const totalCp = Math.round(gold * 100);

      let gp = Math.floor(totalCp / 100);
      let sp = Math.floor((totalCp % 100) / 10);
      let cp = totalCp % 10;

      return { gp, sp, cp };
    }
  };
}
