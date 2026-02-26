# Backdraft Forge - TODO

## Features to Add Later

### Share/Export
- [x] Shareable URL with character data encoded in hash (with compression)
- [x] Print-friendly view (character sheet)
- [ ] PDF export of character sheet

### Visuals
- [x] Character portraits (46/62 race/class/gender combinations)
- [ ] Remaining portraits (16 Half-Elf and Halfling combinations)

### AI Integration
- [ ] AI-generated backstory (provider-agnostic)
- [ ] AI portrait generation (optional alternative to manual portraits)

### Gameplay Additions
- [x] Random name generator (syllable-based, race/gender-appropriate)
- [x] Saving throws calculator (all classes, level 1)
- [x] THAC0 calculator (all classes, level 1)
- [x] Ability score modifiers (STR, DEX, CON, INT, WIS, CHA)
- [x] Full ability modifier breakdown on character sheet (all sub-modifiers per ability)
- [x] Expanded combat block (melee/missile THAC0, damage adj, AC, movement)
- [x] Weapons with calculated THAC0 and damage on character sheet
- [x] Class features and racial abilities on character sheet
- [x] Character sex selection
- [x] Character alignment selection (9 alignments)
- [x] Character physical details (age, height, weight, eyes, hair, deity)
- [x] Languages system (racial + INT-based bonus languages)
- [x] Starting gold rules with reroll limit
- [x] Complete mechanics from AD&D 2E PHB
- [x] Gear list on character sheet (adventuring gear, clothing, ammunition)
- [x] Backstory extended to 5000 chars (with share link size warning)
- [ ] Multi-classing support (demi-humans advance in 2+ classes simultaneously)
- [ ] Dual-classing for humans (switch class, start over at level 1)
- [ ] Character leveling/advancement
- [ ] THAC0 progression for higher levels
- [ ] Saving throw progression for higher levels

### UI/UX
- [ ] Mobile responsiveness improvements
- [ ] Keyboard navigation
- [ ] Undo/redo for choices
- [x] Save character to localStorage (auto-save on completion, resume prompt on return)
- [ ] Load previous characters (multiple save slots)

### Data Completeness
- [ ] More equipment options
- [ ] Complete spell lists by level (currently has starter spells)
- [ ] Priest spell spheres by deity (deity already a freeform field)
- [ ] Ranger species enemy selection
- [ ] Thief skill point allocation
- [x] Racial special abilities details
- [ ] Class kits/variants

## Known Issues
- (none currently known)

## Future Enhancements
- [x] Age, height, weight generation (with race-appropriate tooltip hints)
- [ ] More detailed weapon combat stats (speed factor, range, etc.)
- [x] Encumbrance tracking (equipment shop + character sheet warnings)
- [ ] XP tracking and advancement
- [ ] Notes/journal section

## Refactoring

### Completed
- [x] Split AbilityRoller into ManualEntry + DiceRoller sub-components
- [x] SCSS selectable-card/chip mixins (src/styles/mixins.scss)
- [x] Consolidate App.svelte handlers into single completeStep dispatcher
- [x] Extract ImportArea, ReviewStep, SelectionPreview, SlotCounter components
- [x] Unified makeEmptyCharacter() factory
- [x] Data-driven stepGates for navigation
- [x] Removed ~280 lines dead CSS from app.scss
- [x] Major CSS refactoring: removed all typography overrides from components
  - Added h4, h5, h6 global styles with SCSS variables
  - Created semantic classes (.section-hint, .meta-text, .badge)
  - Removed 118+ font-size declarations across 16 components
  - Replaced hardcoded spacing with SCSS variables ($space-xs through $space-2xl)
  - Removed all utility classes - components now contain only layout CSS
  - Centralized spacing/typography variables in mixins.scss

### Backlog
- [ ] Extract shared AbilityBadge component (ReviewStep + CharacterSheet)
- [ ] Split spells.js by type (wizard/divine)
- [ ] Extract SelectableChip component (proficiencies, spells, languages, equipment)

## Notes
- Using AD&D 2nd Edition PHB rules
- Browser-only, no backend
