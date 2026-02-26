/**
 * Roll a single die
 * @param {number} sides - Number of sides on the die
 * @returns {number}
 */
export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll multiple dice
 * @param {number} count - Number of dice
 * @param {number} sides - Sides per die
 * @returns {number[]} Array of individual rolls
 */
export function rollDice(count, sides) {
  return Array.from({ length: count }, () => rollDie(sides));
}

/**
 * Roll 4d6 for each ability score (raw dice that can be interpreted either way)
 * @returns {number[][]} Array of 6 sets of 4 dice each
 */
export function rollAbilityDice() {
  // DEBUG: Always give high rolls that result in 17 when using 4d6 drop lowest
  // [6,6,6,5] -> drop 5 -> 6+6+6 = 18
  // [6,6,5,1] -> drop 1 -> 6+6+5 = 17
  return [
    [6, 6, 5, 1], // 17
    [6, 6, 5, 1], // 17
    [6, 6, 5, 1], // 17
    [6, 6, 5, 1], // 17
    [6, 6, 5, 1], // 17
    [6, 6, 5, 1]  // 17
  ];
}

/**
 * Calculate score from dice using 3d6 method (first 3 dice)
 * @param {number[]} dice - Array of 4 dice
 * @returns {{ used: number[], total: number }}
 */
export function calculate3d6(dice) {
  const used = dice.slice(0, 3);
  return {
    used,
    total: used.reduce((a, b) => a + b, 0)
  };
}

/**
 * Calculate score from dice using 4d6 drop lowest method
 * @param {number[]} dice - Array of 4 dice
 * @returns {{ used: number[], dropped: number, total: number }}
 */
export function calculate4d6DropLowest(dice) {
  const sorted = [...dice].sort((a, b) => a - b);
  const dropped = sorted[0];
  const used = sorted.slice(1);
  return {
    used,
    dropped,
    total: used.reduce((a, b) => a + b, 0)
  };
}

/**
 * Roll d100 for exceptional strength (warriors with 18 STR)
 * @returns {number} 01-100
 */
export function rollExceptionalStrength() {
  return rollDie(100);
}
