/**
 * Settings store — reactive Svelte 5 state persisted to localStorage.
 */
import { applyTheme, getPreferredTheme } from './theme.js';

const STORAGE_KEY = 'backdraft-settings';

const DEFAULTS = {
  theme: 'auto',         // 'light' | 'dark' | 'auto'
  units: 'imperial',     // 'imperial' | 'metric'
  rollMethod: '4d6drop', // '3d6' | '4d6drop'
  autoRandomize: false,
  fontSize: 'medium',    // 'small' | 'medium' | 'large'
  lenientMode: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

const stored = loadSettings();

// Reactive state
let _theme = $state(stored.theme);
let _units = $state(stored.units);
let _rollMethod = $state(stored.rollMethod);
let _autoRandomize = $state(stored.autoRandomize);
let _fontSize = $state(stored.fontSize);
let _lenientMode = $state(stored.lenientMode);

function save() {
  persist({
    theme: _theme,
    units: _units,
    rollMethod: _rollMethod,
    autoRandomize: _autoRandomize,
    fontSize: _fontSize,
    lenientMode: _lenientMode,
  });
}

/**
 * Resolve 'auto' theme to actual light/dark based on OS preference.
 */
function resolveTheme(theme) {
  if (theme !== 'auto') return theme;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export const settings = {
  get theme() { return _theme; },
  set theme(v) { _theme = v; save(); applyTheme(resolveTheme(v)); },

  get effectiveTheme() { return resolveTheme(_theme); },

  get units() { return _units; },
  set units(v) { _units = v; save(); },

  get rollMethod() { return _rollMethod; },
  set rollMethod(v) { _rollMethod = v; save(); },

  get autoRandomize() { return _autoRandomize; },
  set autoRandomize(v) { _autoRandomize = v; save(); },

  get fontSize() { return _fontSize; },
  set fontSize(v) {
    _fontSize = v;
    save();
    applyFontSize(v);
  },

  get lenientMode() { return _lenientMode; },
  set lenientMode(v) { _lenientMode = v; save(); },
};

/**
 * Apply font size to document root.
 */
export function applyFontSize(size) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-font', size);
}

/**
 * Initialize settings on app mount — apply theme + font size.
 */
export function initSettings() {
  applyTheme(resolveTheme(_theme));
  applyFontSize(_fontSize);

  // Listen for OS theme changes when in auto mode
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (_theme === 'auto') {
        applyTheme(resolveTheme('auto'));
      }
    });
  }
}

// ── Format helpers ──

/**
 * Format height in inches to display string.
 * Imperial: 5'10"  |  Metric: 178 cm
 */
export function formatHeight(inches) {
  if (typeof inches !== 'number') return String(inches);
  if (_units === 'metric') {
    return `${Math.round(inches * 2.54)} cm`;
  }
  const ft = Math.floor(inches / 12);
  const ins = inches % 12;
  return `${ft}'${ins}"`;
}

/**
 * Format weight in lbs to display string.
 * Imperial: 185 lbs  |  Metric: 84 kg
 */
export function formatWeight(lbs) {
  if (typeof lbs !== 'number') return String(lbs);
  if (_units === 'metric') {
    return `${Math.round(lbs * 0.4536)} kg`;
  }
  return `${lbs} lbs`;
}

/**
 * Get weight unit label.
 */
export function formatWeightUnit() {
  return _units === 'metric' ? 'kg' : 'lbs';
}

/**
 * Format encumbrance weight value (number only, no unit).
 * Converts lbs to kg if metric.
 */
export function formatEncumbranceValue(lbs) {
  if (_units === 'metric') return Math.round(lbs * 0.4536);
  return lbs;
}
