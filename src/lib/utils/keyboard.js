import { onMount } from 'svelte';

/**
 * Register a global keydown handler that auto-cleans up on component destroy.
 * @param {(e: KeyboardEvent) => void} handler
 */
export function useGlobalKeydown(handler) {
  onMount(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });
}

/**
 * Check if user is currently typing in an input field.
 * Returns true if the focused element is a text input, textarea, or contenteditable.
 * @returns {boolean} True if user is typing in a text field
 */
export function isTyping() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' && /^(text|search|url|tel|password|number|email)$/i.test(el.type)) return true;
  if (tag === 'TEXTAREA') return true;
  if (el.isContentEditable) return true;
  return false;
}
