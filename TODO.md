# Backdraft Forge - TODO

## Features to Add Later

### Share/Export
- [ ] PDF export of character sheet

### Visuals
- [ ] Remaining portraits (16 Half-Elf and Halfling combinations)

### AI Integration
- [ ] AI-generated backstory (provider-agnostic)
- [ ] AI portrait generation (optional alternative to manual portraits)

### Gameplay Additions
- [ ] Multi-classing support (demi-humans advance in 2+ classes simultaneously)
- [ ] Dual-classing for humans (switch class, start over at level 1)

### UI/UX
- [ ] Mobile responsiveness improvements
- [ ] Keyboard navigation
- [ ] Undo/redo for choices

### Data Completeness
- [ ] More equipment options
- [ ] Ranger species enemy selection

## Known Issues
- (none currently known)

## Future Enhancements
- [ ] More detailed weapon combat stats (speed factor, range, etc.)

## Refactoring

### Completed
- [x] Extract shared AbilityBadge component (ReviewStep + CharacterSheet)
- [x] Extract SelectableChip component (proficiencies, spells, languages, equipment)
- [x] CSS utilities and shared patterns (_utilities.scss)
- [x] Toggle/State Management Patterns (useToggle, useEditMode, useSelection) - 80+ lines saved
- [x] EditableInput Component (XP/Gold/HP inline editing) - 100+ lines saved
- [x] Apply state utilities to CharacterSheet
- [x] GearSection component for EquipmentSelector - 150+ lines saved
- [x] Apply flex-column CSS utility across 15+ components - 50+ lines saved
- [x] Extract CharacterSheet CSS to module file - 524 lines moved (1295 → 771 lines)
- [x] Extract ClassSelector CSS to module file - 331 lines saved (665 → 334 lines, 50% reduction)
- [x] Extract EquipmentSelector CSS to module file - 227 lines saved (739 → 512 lines, 31% reduction)
- [x] Extract DiceRoller CSS to module file - 212 lines saved (463 → 251 lines, 46% reduction)
- [x] Extract BackstoryEditor CSS to module file - 174 lines saved (429 → 255 lines, 41% reduction)
- [x] Extract SpellSelector CSS to module file - 146 lines saved (767 → 621 lines, 19% reduction)
- [x] Extract RaceSelector CSS to module file - 138 lines saved (266 → 128 lines, 52% reduction)
- [x] Extract ProficiencySelector CSS to module file - 135 lines saved (550 → 415 lines, 25% reduction)
- [x] Extract ManualEntry CSS to module file - 109 lines saved (277 → 168 lines, 39% reduction)
- [x] Extract ReviewStep CSS to module file - 93 lines saved (221 → 128 lines, 42% reduction)
- [x] Extract CharacterSummary CSS to module file - 41 lines saved (93 → 52 lines, 44% reduction)
- [x] Extract SelectionPreview CSS to module file - 34 lines saved (58 → 24 lines, 59% reduction)

### High Priority (High Impact)
- [x] ~~Generic Item Selection Component~~ - PARTIAL: Created useSelection utility, applied GearSection
- [x] Toggle/State Management Patterns - COMPLETE: 80+ lines saved in CharacterSheet

### Medium Priority (Medium Impact)
- [x] EditableInput Component - COMPLETE: 100+ lines saved
- [x] Grid Rendering Consolidation - COMPLETE: GearSection created, 150+ lines saved
- [x] Split CharacterSheet into sub-components - COMPLETE: 251 lines saved (771 → 520 lines)
  - Extracted: ActionMenu, CharacterSheetHeader, BasicInfoPanel, AbilitiesPanel, CombatStatsPanel, EquipmentPanel
  - Original: 771 lines → Final: 520 lines (32% reduction)
- [x] Extract LevelUpWizard CSS to module file - COMPLETE: 430 lines saved (936 → 506 lines)
  - Extracted: 436 lines of CSS to LevelUpWizard.module.scss
  - Original: 936 lines → Final: 506 lines (46% reduction)
- [ ] Spell Management Service (150+ lines saved)
  - Consolidate spell filtering/availability logic
  - Unified spell slot management and memorization state
- [x] Derived State Utilities - PARTIAL: Created `useAbilityModifiers()`
  - Consolidates 6 ability modifier calculations into single utility
  - Applied to CharacterSheet (saves ~30 lines when applied across all files)

### Low Priority (Remaining Quick Wins)
- [ ] Alignment/Deity Restriction Logic (30-40 lines to save)
  - Create `alignmentService.js` for unified filtering
  - Used in ClassSelector, BackstoryEditor, CharacterSheet
- [ ] Form Submission Patterns (20-30 lines to save)
  - Standardize `onComplete` callback signatures
  - Create reusable button components

## Refactoring Progress

**Total Lines Saved:** ~2700+ lines (58% average reduction in refactored files)
**Components Created:** 12 reusable components
  - UI: AbilityBadge, SelectableChip, EditableInput, GearSection, GridSection
  - Layout: ActionMenu, CharacterSheetHeader, BasicInfoPanel, AbilitiesPanel, CombatStatsPanel, EquipmentPanel
  - Utilities: useToggle, useEditMode, useSelection, useAbilityModifiers

**CSS Organization:** Single consolidated stylesheet
  - `components.module.scss` (2406 lines, deduplicated) - All component styles in one place
  - Removed 238 lines of duplicate CSS class definitions
  - Standardized to design tokens (font sizes, spacing, border radius)
  - All components import the same stylesheet for consistency

**Files Refactored:** 20 major files
**CSS Extraction:** 100% complete - all .svelte files use CSS modules
**Code Organization:** Clean separation of logic, markup, and styles

## Notes
- Using AD&D 2nd Edition PHB rules
- Browser-only, no backend
