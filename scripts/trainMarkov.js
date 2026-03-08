/**
 * Markov chain trainer for name generation.
 *
 * Reads training name lists from src/data/training/*.json
 * and outputs baked chain data to src/data/markovChains.js.
 *
 * Usage: node scripts/trainMarkov.js
 *
 * Filename convention:
 *   first.{race}.{gender}.json  → chains.first[race][gender]
 *   surname.{race}.json         → chains.surname[race]
 *   surname.human.{geo}.json    → chains.surname.human[geo]
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRAINING_DIR = join(__dirname, '../src/data/training');
const OUTPUT_FILE = join(__dirname, '../src/data/markovChains.js');
const GRAM_SIZE = 2;
const MIN_TRAINING_NAMES = 30;

// ─── Chain Training ───────────────────────────────────────────────────────────

/**
 * Build a bigram Markov chain from an array of name strings.
 * Returns { starters, transitions } where:
 *   starters:    { "Al": 3, "Be": 2 }   — opening bigrams weighted by frequency
 *   transitions: { "Al": { "d": 5, "END": 1 } }  — next-char probabilities
 */
function trainChain(names) {
  const starters = {};
  const transitions = {};

  for (const raw of names) {
    const name = raw.trim();
    if (name.length < 3) continue;

    // Record starter (first GRAM_SIZE chars)
    const starter = name.slice(0, GRAM_SIZE);
    starters[starter] = (starters[starter] || 0) + 1;

    // Walk each bigram → next char transition
    for (let i = 0; i <= name.length - GRAM_SIZE; i++) {
      const gram = name.slice(i, i + GRAM_SIZE);
      const next = i + GRAM_SIZE < name.length ? name[i + GRAM_SIZE] : 'END';

      if (!transitions[gram]) transitions[gram] = {};
      transitions[gram][next] = (transitions[gram][next] || 0) + 1;
    }
  }

  // Guard: ensure every gram has a path to END.
  // If a gram has no END and all continuations are dead ends, add synthetic END.
  for (const gram of Object.keys(transitions)) {
    if (!hasPathToEnd(gram, transitions, new Set())) {
      transitions[gram]['END'] = (transitions[gram]['END'] || 0) + 1;
    }
  }

  return { starters, transitions };
}

/**
 * Recursively check if a gram can reach END via transitions.
 * Uses a visited set to prevent infinite loops.
 */
function hasPathToEnd(gram, transitions, visited) {
  if (visited.has(gram)) return false;
  visited.add(gram);

  const nexts = transitions[gram];
  if (!nexts) return false;
  if (nexts['END']) return true;

  return Object.keys(nexts).some(char => {
    // Next gram = last char of current gram + next char
    const nextGram = gram.slice(1) + char;
    return hasPathToEnd(nextGram, transitions, visited);
  });
}

// ─── Filename Parsing ─────────────────────────────────────────────────────────

/**
 * Parse a training filename into a chain key path.
 *
 * Examples:
 *   "first.human.male.json"     → { type: 'first',   keys: ['human', 'male'] }
 *   "surname.dwarf.json"        → { type: 'surname',  keys: ['dwarf'] }
 *   "surname.human.coastal.json"→ { type: 'surname',  keys: ['human', 'coastal'] }
 */
function parseFilename(filename) {
  const withoutExt = filename.replace(/\.json$/, '');
  const parts = withoutExt.split('.');
  return {
    type: parts[0],
    keys: parts.slice(1),
  };
}

/**
 * Set a deeply nested value in an object using an array of keys.
 * setNested(obj, ['a', 'b', 'c'], val) → obj.a.b.c = val
 */
function setNested(obj, keys, value) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]]) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const files = readdirSync(TRAINING_DIR).filter(f => f.endsWith('.json'));

  if (files.length === 0) {
    console.error(`No .json files found in ${TRAINING_DIR}`);
    process.exit(1);
  }

  const chains = { first: {}, surname: {} };
  let totalNames = 0;
  let warnings = 0;

  for (const file of files.sort()) {
    const { type, keys } = parseFilename(file);

    if (!chains[type]) {
      console.warn(`⚠  Unknown type "${type}" in ${file} — skipping`);
      warnings++;
      continue;
    }

    const raw = readFileSync(join(TRAINING_DIR, file), 'utf8');
    let names;
    try {
      names = JSON.parse(raw);
    } catch (e) {
      console.error(`✗  Failed to parse ${file}: ${e.message}`);
      process.exit(1);
    }

    if (!Array.isArray(names)) {
      console.error(`✗  ${file} must be a JSON array`);
      process.exit(1);
    }

    if (names.length < MIN_TRAINING_NAMES) {
      console.warn(`⚠  ${file} has only ${names.length} names (minimum ${MIN_TRAINING_NAMES}) — chain may be repetitive`);
      warnings++;
    }

    const chain = trainChain(names);
    setNested(chains[type], keys, chain);

    totalNames += names.length;
    const starterCount = Object.keys(chain.starters).length;
    const gramCount = Object.keys(chain.transitions).length;
    console.log(`✓  ${file.padEnd(36)} ${String(names.length).padStart(3)} names → ${starterCount} starters, ${gramCount} grams`);
  }

  // ─── Output ──────────────────────────────────────────────────────────────────

  const output = `// Auto-generated by scripts/trainMarkov.js — do not edit manually
// Run: node scripts/trainMarkov.js
// Training files: ${files.length} | Total names: ${totalNames}
// Generated: ${new Date().toISOString()}

export const chains = ${JSON.stringify(chains, null, 2)};
`;

  writeFileSync(OUTPUT_FILE, output, 'utf8');

  console.log('');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Files processed : ${files.length}`);
  console.log(`  Total names     : ${totalNames}`);
  console.log(`  Warnings        : ${warnings}`);
  console.log(`  Output          : src/data/markovChains.js`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  if (warnings > 0) {
    console.log(`\n⚠  Completed with ${warnings} warning(s)`);
  } else {
    console.log(`\n✓  Done`);
  }
}

main();
