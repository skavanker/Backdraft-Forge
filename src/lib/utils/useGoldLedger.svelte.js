/**
 * Gold ledger composable for EquipmentSelector.
 * Manages gold state with buy/sell/afford operations.
 */
import { priceToGp } from '../../data/equipment.js';

/**
 * @returns Gold ledger with reactive state and helpers
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
      gold = existingEquipment.remaining ?? existingEquipment.gold ?? 0;
      goldRolled = true;
      goldDice = existingEquipment.goldDice || [];
      goldDiceFormula = existingEquipment.goldDiceFormula || '';
      goldDieSize = existingEquipment.goldDieSize || 6;
    }
  };
}
