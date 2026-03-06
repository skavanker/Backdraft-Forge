/**
 * Generic persistence factory for localStorage-backed collections.
 *
 * @param {Object} config
 * @param {string} config.key - localStorage key
 * @param {string} config.label - Human label for error messages
 * @param {Function} config.buildEntry - (item) => entry object to store
 * @param {Function} config.getIdField - (entry) => identity value for delete/dedup
 * @param {boolean} [config.dedupeOnSave] - Skip save if entry already exists
 * @returns {{ load, save, remove, clearAll, exportToFile, importFromFile }}
 */
export function createPersistenceStore(config) {
  const { key, label, buildEntry, getIdField, dedupeOnSave = false } = config;

  function load() {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error(`Failed to load ${label}:`, error);
      return [];
    }
  }

  function save(item, existing = []) {
    try {
      if (dedupeOnSave) {
        const entry = buildEntry(item);
        const id = getIdField(entry);
        if (existing.some(e => getIdField(e) === id)) {
          return existing;
        }
        const updated = [entry, ...existing];
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      }

      const entry = buildEntry(item);
      const updated = [entry, ...existing];
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error(`Failed to save ${label}:`, error);
      return existing;
    }
  }

  function remove(id, existing = []) {
    try {
      const filtered = existing.filter(e => getIdField(e) !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
      return filtered;
    } catch (error) {
      console.error(`Failed to delete ${label}:`, error);
      return existing;
    }
  }

  function clearAll() {
    try {
      localStorage.removeItem(key);
      return [];
    } catch (error) {
      console.error(`Failed to clear ${label}:`, error);
      return [];
    }
  }

  function exportToFile(items, filename) {
    try {
      const dataStr = JSON.stringify(items, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to export ${label}:`, error);
    }
  }

  async function importFromFile(file, existing = []) {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);

      if (!Array.isArray(imported)) {
        throw new Error('Invalid import file format');
      }

      const updated = [...existing, ...imported];
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error(`Failed to import ${label}:`, error);
      return existing;
    }
  }

  return { load, save, remove, clearAll, exportToFile, importFromFile };
}
