import { isTyping } from './keyboard.js';

/**
 * Register global keyboard shortcuts for the app.
 * Should be called from within onMount and returns a cleanup function.
 *
 * @param {Object} context - App state and callbacks
 * @param {Function} context.getCurrentStep - Get current step index
 * @param {Function} context.getSettingsOpen - Get settings panel state
 * @param {Function} context.getShowResetConfirm - Get reset confirmation state
 * @param {Function} context.getUndoStack - Get undo history
 * @param {Function} context.saveMidCreation - Save WIP callback
 * @param {Function} context.exportCharacterCode - Export callback
 * @param {Function} context.undo - Undo callback
 * @param {Function} context.setSettingsOpen - Settings toggle
 * @param {Function} context.setShowResetConfirm - Reset confirmation toggle
 * @param {Function} context.goToStep - Navigation callback
 * @param {number} context.STEP_SHEET - Constant for sheet step
 * @returns {Function} - Cleanup function to remove event listener
 */
export function setupAppKeyboardShortcuts(context) {
  function handleKeydown(e) {
    // Ctrl+S — save progress
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      context.saveMidCreation();
      return;
    }

    // Ctrl+E — export character code (on sheet step)
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      if (context.getCurrentStep() === context.STEP_SHEET) {
        e.preventDefault();
        context.exportCharacterCode();
      }
      return;
    }

    // Ctrl+Z — undo on character sheet
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      if (context.getCurrentStep() === context.STEP_SHEET && context.getUndoStack().length > 0) {
        e.preventDefault();
        context.undo();
      }
      return;
    }

    // Escape — close settings/reset popup or go back a step
    if (e.key === 'Escape') {
      if (context.getSettingsOpen()) {
        context.setSettingsOpen(false);
      } else if (context.getShowResetConfirm()) {
        context.setShowResetConfirm(false);
      } else if (context.getCurrentStep() > 0 && context.getCurrentStep() < context.STEP_SHEET) {
        context.goToStep(context.getCurrentStep() - 1);
      }
      return;
    }

    // Arrow keys — move focus like Tab/Shift+Tab
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      if (isTyping()) return;
      const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
      const focusable = [...document.querySelectorAll(
        '.content button:not(:disabled), .content input:not(:disabled), .content select:not(:disabled), .content textarea:not(:disabled), .content [tabindex]:not([tabindex="-1"])'
      )];
      if (focusable.length === 0) return;
      const idx = focusable.indexOf(document.activeElement);
      const next = forward
        ? (idx + 1) % focusable.length
        : (idx - 1 + focusable.length) % focusable.length;
      e.preventDefault();
      focusable[next].focus();
    }
  }

  window.addEventListener('keydown', handleKeydown);
  return () => window.removeEventListener('keydown', handleKeydown);
}
