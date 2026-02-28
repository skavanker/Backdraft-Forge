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
- [ ] Random NPC generator (reuse existing race/class/mechanics logic)
  - Auto-roll abilities, pick qualifying race/class, calculate HP/THAC0/saves
  - Auto-select proficiencies, equipment (within gold budget), spells if caster
  - Options: level range, class/race constraints, quick vs detailed mode
  - Bulk generation (e.g., "6 town guards")
  - Stat block display format (simpler than full character sheet)
- [ ] Monster/Bestiary tool (could be a separate "app" sharing core logic)
  - Monster stat block data (HD, AC, THAC0, #Att, Dmg, Special, Morale, XP, etc.)
  - Start with ~50-100 common monsters, expand over time (main effort is data entry)
  - Bestiary browser with search/filter (by HD, type, terrain)
  - Random encounter generator (by terrain/dungeon level)
  - Reuse: dice roller, THAC0/save tables, PDF/print export, parchment styling
- [ ] Treasure/loot generator (Treasure Types A-Z from Monstrous Manual)
  - Ties into bestiary (each monster has a Treasure Type)
  - Reuse existing equipment/gold data for mundane loot
  - Magic item tables (random rolls per DMG)
- [ ] Expanded name generator (NPCs, taverns, towns, shops)
  - Build on existing names.js data

### UI/UX
- [ ] Mobile responsiveness improvements

### Settings Panel Enhancements
- [ ] Custom starting gold multiplier
- Wait for settings feature to land before planning more — house rules stuff should live there

## Bugs

_None currently tracked_

## Code Quality & Technical Debt

### Documentation Gaps
- [ ] Add JSDoc to remaining exported utility functions (characterAccessors.js and xpUtils.js now documented)
- [ ] Document error handling patterns project-wide
- [ ] Add inline comments for complex logic blocks (stepManager.svelte.js now documented)

