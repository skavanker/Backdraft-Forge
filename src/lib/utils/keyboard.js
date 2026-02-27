/** Returns true if the focused element is a text input, textarea, or contenteditable. */
export function isTyping() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' && /^(text|search|url|tel|password|number|email)$/i.test(el.type)) return true;
  if (tag === 'TEXTAREA') return true;
  if (el.isContentEditable) return true;
  return false;
}
