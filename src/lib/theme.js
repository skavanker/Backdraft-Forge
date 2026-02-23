/**
 * Theme management - persists to localStorage
 */

const STORAGE_KEY = 'backdraft-theme';

export function getStoredTheme() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredTheme(theme) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored) return stored;

  // Check OS preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return 'light';
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  setStoredTheme(theme);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

// Initialize on load
export function initTheme() {
  applyTheme(getPreferredTheme());
}
