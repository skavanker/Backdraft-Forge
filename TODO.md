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
- [ ] **Integration with existing systems**
  - [ ] Update Character Creator to use weighted names (BackstoryEditor.svelte)
  - [ ] Update NPC Generator to use weighted names with archetype context
  - [ ] Update Treasure Generator owner names (if applicable)
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
- [ ] Mobile responsiveness improvements

### Settings Panel Enhancements
- [ ] Custom starting gold multiplier
- Wait for settings feature to land before planning more — house rules stuff should live there

## Bugs

_None currently tracked_

## Code Quality & Technical Debt

### Standardization
- [ ] **Standardize button usage across codebase**
  - Use `.btn-primary` for primary actions (e.g., "Generate", "Continue", "Save")
  - Use `.btn-ghost` for secondary actions (e.g., "Cancel", "Back")
  - Use `.btn-clear` for destructive/clear actions (e.g., "Clear All")
  - Use `.btn-sm` modifier for compact buttons
  - Use `.selected` class on `.btn-primary` for active state (mode/category buttons)
  - Only use custom button classes for special cases (delete buttons, icon-only buttons, etc.)
  - Audit all components and replace custom button CSS with standard classes

### Documentation Gaps
- [ ] Add JSDoc to remaining exported utility functions
- [ ] Document error handling patterns project-wide
- [ ] Add inline comments for complex logic blocks

