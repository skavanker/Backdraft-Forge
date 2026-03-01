# Error Handling Patterns

This document describes error handling conventions used throughout Backdraft Forge codebase.

## Core Principles

1. **Graceful Degradation** - Errors should not crash the app; always provide fallback values
2. **Silent Failures for Non-Critical Operations** - localStorage operations fail silently
3. **User Feedback for Critical Operations** - Important failures show alerts/toasts
4. **Return Values Over Exceptions** - Prefer returning `null` or fallback values
5. **Console Logging for Debugging** - Log errors to console for development/debugging

## Patterns by Use Case

### 1. localStorage Operations (Silent Failures)

**Pattern:** Try-catch with fallback, no user notification

```javascript
// Loading data - return fallback on error
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

// Saving data - fail silently
function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}
```

**Files:**
- `src/lib/persistence.svelte.js` - Character saves, WIP data
- `src/lib/settings.svelte.js` - User settings
- `src/lib/npcPersistence.svelte.js` - NPC saves
- `src/lib/treasurePersistence.svelte.js` - Treasure saves

**Rationale:**
- localStorage can fail due to:
  - QuotaExceededError (storage full)
  - Browser privacy modes
  - Corrupted data
- App should continue working even if persistence fails
- User data already exists in memory; only persistence is affected

### 2. Data Encoding/Decoding (Return Null + Console Log)

**Pattern:** Try-catch with null return and console.error

```javascript
export function encodeCharacter(character) {
  try {
    const compressed = compressCharacter(character);
    const json = JSON.stringify(compressed);
    // ... compression logic
    return urlSafe;
  } catch (error) {
    console.error('Failed to encode character:', error);
    return null;
  }
}

export async function decodeCharacter(encoded) {
  try {
    // ... decoding logic
    return character;
  } catch (error) {
    console.error('Failed to decode character:', error);
    return null;
  }
}
```

**Files:**
- `src/lib/shareCharacter.js` - Character sharing URL encoding/decoding

**Rationale:**
- Invalid data can come from:
  - User tampering with URLs
  - Data corruption
  - Version incompatibilities
- Logging helps debug issues with shared URLs
- Returning `null` allows caller to handle gracefully

### 3. Clipboard Operations (Fallback + User Feedback)

**Pattern:** Try main method, catch and try fallback, return boolean

```javascript
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // ... fallback logic
      return true;
    } catch (fallbackError) {
      console.error('Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
}
```

**Files:**
- `src/lib/shareCharacter.js` - Copy character code
- `src/lib/components/NameResults.svelte` - Copy generated names
- `src/lib/components/TreasureHoard.svelte` - Copy treasure
- `src/lib/components/TreasureItemList.svelte` - Copy items

**Rationale:**
- Clipboard API can fail due to:
  - Browser permissions
  - Security restrictions (HTTP vs HTTPS)
  - Older browser support
- Fallback provides compatibility
- Boolean return lets caller show toast/alert to user

### 4. Async Data Generation (User Alert on Failure)

**Pattern:** Try-catch with setTimeout, user alert on error

```javascript
function handleGenerate(options) {
  isGenerating = true;

  setTimeout(async () => {
    try {
      const hoards = await generateTreasure(options);
      generatedHoards = hoards;
    } catch (error) {
      console.error('Failed to generate treasure:', error);
      alert('Failed to generate treasure. Please try again.');
    } finally {
      isGenerating = false;
    }
  }, 100);
}
```

**Files:**
- `src/lib/TreasureGenerator.svelte` - Treasure generation
- `src/lib/NPCGenerator.svelte` - NPC generation

**Rationale:**
- Generation failures are unexpected (logic errors)
- User needs to know the operation failed
- setTimeout prevents UI blocking
- `finally` ensures loading state is cleared

## Best Practices

### DO ✅

1. **Always provide fallback values**
   ```javascript
   try {
     return JSON.parse(data);
   } catch {
     return {}; // Default empty object
   }
   ```

2. **Log errors for debugging**
   ```javascript
   catch (error) {
     console.error('Failed to decode:', error);
     return null;
   }
   ```

3. **Return null for failed operations**
   ```javascript
   export async function loadSavedCharacter(entry) {
     try {
       return await decodeCharacter(entry.code);
     } catch (e) {
       return null; // Caller can check for null
     }
   }
   ```

4. **Use finally for cleanup**
   ```javascript
   try {
     isLoading = true;
     await doWork();
   } finally {
     isLoading = false; // Always cleanup
   }
   ```

### DON'T ❌

1. **Don't throw errors from utility functions**
   ```javascript
   // ❌ Bad
   export function parse(data) {
     return JSON.parse(data); // Can throw!
   }

   // ✅ Good
   export function parse(data) {
     try {
       return JSON.parse(data);
     } catch {
       return null;
     }
   }
   ```

2. **Don't ignore critical errors**
   ```javascript
   // ❌ Bad - silently fails for important operation
   try {
     await saveCharacterToServer(char);
   } catch { /* ignore */ }

   // ✅ Good - notify user
   try {
     await saveCharacterToServer(char);
   } catch (error) {
     console.error('Save failed:', error);
     alert('Failed to save character. Please try again.');
   }
   ```

3. **Don't use empty catch blocks without comment**
   ```javascript
   // ❌ Bad
   try {
     localStorage.setItem(key, val);
   } catch {}

   // ✅ Good
   try {
     localStorage.setItem(key, val);
   } catch { /* silently fail - non-critical */ }
   ```

## Error Categories

| Category | Pattern | Example |
|----------|---------|---------|
| **localStorage** | Silent failure, return fallback | Settings, saves, WIP |
| **Encoding/Decoding** | Return null, log error | Character sharing |
| **Clipboard** | Try fallback, return boolean | Copy operations |
| **Generation** | Alert user, log error | NPC, Treasure generation |
| **Validation** | Return false/null | Input validation |

## Future Improvements

Consider implementing:

1. **Toast notification system** - Replace alerts with nicer UI
2. **Error boundary component** - Catch React-style errors in Svelte
3. **Retry logic** - For network operations (when backend added)
4. **Structured error types** - Define error classes for different scenarios
5. **Error reporting service** - Send critical errors to monitoring (Sentry, etc.)

## Related Files

- `src/lib/persistence.svelte.js` - Character persistence patterns
- `src/lib/settings.svelte.js` - Settings persistence
- `src/lib/shareCharacter.js` - Character encoding/decoding
- `src/lib/components/Toast.svelte` - Toast notifications (planned)
