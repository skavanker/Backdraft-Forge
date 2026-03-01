# Backdraft Forge - TODO

## Features to Add

### UI/UX Improvements
- [ ] **Character Management Modal** — Replace inline editing with modal-based adjustments
  - Create reusable `StepModal.svelte` and `ModalStep.svelte` base components
  - Build `ManageCharacterModal.svelte` with panels for:
    - XP adjustment (add/remove with quick buttons +100, +500, +1000, custom)
    - Gold adjustment (gp/sp/cp breakdown)
    - HP adjustment (heal/damage/rest)
    - Spell slot management (restore/mark used)
    - Quick rest & recovery
  - Refactor `LevelUpWizard.svelte` to use `StepModal` base (DRY - don't repeat modal logic)
  - More intuitive than click-to-edit pattern
  - Similar UX to level-up wizard (menu → select panel → back to menu)

### Share/Export
- [ ] PDF export of character sheet
- [ ] Full JSON export/import option
  - Share URL (current) only stores keys, loses items if data changes
  - JSON export should store complete item data (name, stats, etc.) for robustness
  - Allows characters to survive equipment/spell data changes between versions
  - User can choose: Quick URL share (compact, potentially lossy) vs JSON file (complete, bulletproof)
- [ ] Do research if another like char fil excist other places and maybe use same format.

### Visuals
- [ ] Remaining portraits (16 Half-Elf and Halfling combinations)

### AI Integration
- [ ] AI-generated backstory (provider-agnostic)
- [ ] AI portrait generation (optional alternative to manual portraits)

### Gameplay Additions
- [ ] Multi-classing support (demi-humans advance in 2+ classes simultaneously)
- [ ] Dual-classing for humans (switch class, start over at level 1)

### DM Tools

#### NPC Generator
- [ ] **UI/UX improvements** - Current layout needs significant work
- [ ] **Better stat block formatting** - Make more compact and readable
- [ ] **Export/print functionality** - PDF or printer-friendly format
- [ ] **Edit generated NPCs** - Allow tweaking after generation
- [ ] **More archetypes** - Add additional common NPC types
- [ ] **Equipment package refinement** - Better variety and realism
- [ ] **Spell selection for casters** - Currently auto-generated, needs review

#### Treasure Generator
- [ ] **UI/UX improvements** - Current layout needs significant work
- [ ] **Better treasure display** - More organized, easier to read
- [ ] **Magic item details** - Expand beyond just names (descriptions, stats)
- [ ] **Mundane treasure improvements** - Better variety and context
- [ ] **Coin conversion helper** - Quick gp/sp/cp conversions
- [ ] **Export/print functionality** - PDF or printer-friendly format
- [ ] **Treasure hoard templates** - Pre-made hoards for common scenarios
- [ ] **Integration with character sheet** - Direct import to character equipment

#### Monster/Bestiary Tool
- [ ] Monster stat block data (HD, AC, THAC0, #Att, Dmg, Special, Morale, XP, etc.)
- [ ] Start with ~50-100 common monsters, expand over time (main effort is data entry)
- [ ] Bestiary browser with search/filter (by HD, type, terrain)
- [ ] Random encounter generator (by terrain/dungeon level)
- [ ] Reuse: dice roller, THAC0/save tables, PDF/print export, parchment styling
- [ ] Tie to treasure generator (each monster has a Treasure Type)

#### Name Generator - Future Enhancements
- [x] **Integration with existing systems**
  - [x] Update Character Creator to use weighted names (BackstoryEditor.svelte)
  - [x] Update NPC Generator to use weighted names with archetype context
  - [x] Treasure Generator owner names (N/A - doesn't generate owners)
- [ ] **Additional races** - Half-Orc, Drow, etc.
- [ ] **Bulk generation** - 100+ names at once
- [ ] **Custom syllable pools** - User-defined syllables
- [ ] **Item naming** - Magic Items, Weapons, Armor, Artifacts
- [ ] **Additional name types**:
  - [ ] Dragon names
  - [ ] Demon/Devil names
  - [ ] Deity names
  - [ ] Guild/Organization names
  - [ ] Ship names
  - [ ] Spell names
  - [ ] Magic item names
- [ ] **Persistence** - Save favorite names to localStorage
- [ ] **Export names** - Export as list/CSV

### UI/UX
- [x] Mobile responsiveness improvements
  - Reduced app padding on mobile from 1.5rem to 1rem
  - Made h1 headings responsive (2.5rem → 1.75rem on mobile)
  - Improved character sheet layout: portrait smaller (200px → 150px), abilities grid 3x2 instead of 6x1
  - Enhanced grid layouts: grid-chips uses 2 columns minimum on mobile
  - Larger touch targets: inputs/textareas use 16px font (prevents iOS zoom), increased padding
  - Stack two-column layouts on mobile for better readability
  - Consistent use of `@include mobile` mixin instead of hardcoded breakpoints

### Settings Panel Enhancements
- [ ] Custom starting gold multiplier
- Wait for settings feature to land before planning more — house rules stuff should live there

## Bugs

_None currently tracked_

## Code Quality & Technical Debt

### Standardization
- [x] **Standardize button usage across codebase**
  - Use `.btn-primary` for primary actions (e.g., "Generate", "Continue", "Save")
  - Use `.btn-secondary` for secondary actions (e.g., "Cancel", "Back")
  - Use `.btn-clear` for destructive/clear actions (e.g., "Clear All")
  - Use `.btn-sm` modifier for compact buttons
  - Use `.btn-lg` modifier for large buttons
  - Use `.selected` class on `.btn-primary` for active state (mode/category buttons)
  - Only use custom button classes for special cases (delete buttons, icon-only buttons, etc.)
  - Removed redundant custom buttons: `.btn-random`, `.btn-levelup`, `.btn-confirm`, `.btn-roll`, `.btn-add`, `.btn-action`
  - Renamed `.btn-ghost` to `.btn-secondary` for clarity (industry standard naming)
  - Kept special-purpose buttons: `.close-btn`, `.settings-action-btn`, `.view-all-btn`, `.roll-die-icon`

### Documentation Gaps
- [x] Add JSDoc to remaining exported utility functions
  - All utility functions now have comprehensive JSDoc documentation
  - Improved `isTyping()` in keyboard.js with proper JSDoc format
  - Enhanced `useGoldLedger()` return type documentation
- [x] Document error handling patterns project-wide
  - Created `docs/ERROR_HANDLING.md` with comprehensive error handling guide
  - Documented 4 main patterns: localStorage, encoding/decoding, clipboard, async generation
  - Included best practices and anti-patterns
- [x] Add inline comments for complex logic blocks
  - Added detailed comments to weighted syllable selection algorithm in `nameGenerator.js`
  - Explained ability score change reset logic in `stepManager.svelte.js`
  - Documented archetype override system in `npcGenerator.js`
  - Clarified equipment restoration for custom items in `characterRestore.svelte.js`
  - Explained dice tumbling animation with ease-out curve in `HPRollStep.svelte`

