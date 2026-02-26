/**
 * AD&D 2E Alignment System
 * Alignments stored as numbers 0-8 for efficiency
 */

// Alignment constants
export const ALIGNMENTS = {
  LG: 0, // Lawful Good
  NG: 1, // Neutral Good
  CG: 2, // Chaotic Good
  LN: 3, // Lawful Neutral
  N: 4,  // True Neutral
  CN: 5, // Chaotic Neutral
  LE: 6, // Lawful Evil
  NE: 7, // Neutral Evil
  CE: 8  // Chaotic Evil
};

// Reverse mapping for display
export const ALIGNMENT_NAMES = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil'
];

/**
 * Get alignment name from number
 * @param {number} alignment - Alignment number (0-8)
 * @returns {string} Alignment name
 */
export function getAlignmentName(alignment) {
  return ALIGNMENT_NAMES[alignment] || 'Unknown';
}

/**
 * Get alignment number from name
 * @param {string} name - Alignment name
 * @returns {number|null} Alignment number or null if not found
 */
export function getAlignmentNumber(name) {
  const index = ALIGNMENT_NAMES.indexOf(name);
  return index >= 0 ? index : null;
}

/**
 * Check if character alignment is compatible with deity alignment
 * AD&D 2E: cleric must be within one step of deity's alignment
 * @param {number} charAlign - Character alignment (0-8)
 * @param {number} deityAlign - Deity alignment (0-8)
 * @returns {boolean} True if compatible
 */
export function isAlignmentCompatible(charAlign, deityAlign) {
  if (deityAlign === null || deityAlign === undefined) return true;
  if (charAlign === null || charAlign === undefined) return false;

  // Calculate row (0=Good, 1=Neutral, 2=Evil) and column (0=Lawful, 1=Neutral, 2=Chaotic)
  const charRow = Math.floor(charAlign / 3);
  const charCol = charAlign % 3;
  const deityRow = Math.floor(deityAlign / 3);
  const deityCol = deityAlign % 3;

  // Within one step means max difference of 1 in each axis
  return Math.abs(charRow - deityRow) <= 1 && Math.abs(charCol - deityCol) <= 1;
}

/**
 * Get allowed alignments for a deity (within one step)
 * @param {number} deityAlign - Deity alignment (0-8)
 * @returns {number[]} Array of allowed alignment numbers
 */
export function getAllowedAlignments(deityAlign) {
  if (deityAlign === null || deityAlign === undefined) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8]; // All alignments
  }

  const allowed = [];
  for (let i = 0; i < 9; i++) {
    if (isAlignmentCompatible(i, deityAlign)) {
      allowed.push(i);
    }
  }
  return allowed;
}

/**
 * Get alignment grid layout (3x3)
 * @returns {number[][]} 3x3 grid of alignment numbers
 */
export function getAlignmentGrid() {
  return [
    [0, 1, 2], // Good row
    [3, 4, 5], // Neutral row
    [6, 7, 8]  // Evil row
  ];
}
