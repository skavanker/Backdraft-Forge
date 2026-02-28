# Backdraft Forge - TODO

## Features to Add

### Share/Export
- [ ] PDF export of character sheet
- [ ] Full JSON export/import option
  - Share URL (current) only stores keys, loses items if data changes
  - JSON export should store complete item data (name, stats, etc.) for robustness
  - Allows characters to survive equipment/spell data changes between versions
  - User can choose: Quick URL share (compact, potentially lossy) vs JSON file (complete, bulletproof)

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

### Prep for Multi/Dual-Class (don't implement, just reduce coupling)
- [ ] Add character accessor helpers — `getClassGroup(char)`, `getClassKey(char)`, `isWarrior(char)` etc. instead of direct `character.cls.group` access everywhere
- [ ] Wrap THAC0/Saves/HP functions to accept `character` instead of raw `classGroup` + `level` args
- [ ] Centralize XP logic into a utility (currently split between CharacterSheet and LevelUpWizard)
- [ ] Add multi-class combo data to races.js (just the data, no logic)

### Data Completeness
- [ ] More detailed weapon combat stats (speed factor, range, etc.)

## Bugs

### High Priority
- [ ] **Equipment Mount Race Condition** (src/lib/EquipmentSelector.svelte:188-231) — Gold ledger modified during mount, could cause inconsistent state.
- [ ] **Thief Starting Skills** — No UI for distributing initial 60 discretionary points during character creation. Thieves currently start with only base skills. Needs new step or integration into Review/Proficiency step.

### Medium Priority
- [ ] **HP Auto-Set During Render** (src/lib/LevelUpWizard.svelte:119-124) — HP set in top-level code, could reset during re-render.

## Code Quality & Technical Debt

### Component Refactoring (Over 500 Lines)
- [ ] **Split App.svelte** (780 lines) — Extract step management, keyboard handlers, save/load logic
- [ ] **Split LevelUpWizard.svelte** (507 lines) — Extract step components (HPRollStep, ThiefSkillsStep, SpellsStep)
- [ ] **Split EquipmentSelector.svelte** (505 lines) — Extract gold ledger UI and custom item form

### Code Quality Issues
- [ ] **Large handleKeydown** (src/App.svelte:126-183, 57 lines) — Extract keyboard shortcuts to utility
- [ ] **Large compressCharacter** (src/lib/shareCharacter.js:12-115, 103 lines) — Split by data category
- [ ] **Large decompressCharacter** (src/lib/shareCharacter.js:139-297, 158 lines) — Split into transformer functions
- [ ] **Duplicated Equipment Selection** (src/lib/EquipmentSelector.svelte:82-102) — Extract common pattern for selectArmor/selectShield
- [ ] **Paladin Auto-Alignment Magic** (src/lib/ClassSelector.svelte:58-92) — Add comment explaining behavior

### Documentation Gaps
- [ ] Add JSDoc to 15+ exported utility functions (see code-review-report.md for full list)
- [ ] Document error handling patterns project-wide
- [ ] Add inline comments for complex logic blocks
- [ ] Document the 19 ability cap in races.js

### CSS/SCSS Issues

#### High Priority
- [ ] **Add Missing Design Tokens** — $text-xs, $text-xl, $text-xxl, $space-xs for consistency
- [ ] **Consolidate Badge Styles** — Single source in _utilities.scss (removes 30-40 duplicate lines)
- [ ] **Create Print Stylesheet** — _print.scss with white backgrounds, black text, page breaks
- [ ] **Standardize Breakpoints** — Create mixin system for responsive design
- [ ] **Increase Touch Targets** — 44px minimum for mobile buttons

#### Medium Priority
- [ ] Remove questionable !important from _levelup.scss:143
- [ ] Unify .data-row and .info-row patterns
- [ ] Add parchment texture/noise for enhanced aesthetic
- [ ] Document magic numbers with inline comments

### AD&D Rules Verification Needed
- [ ] **Bard Spell Slots** — Verify against PHB Table 23
- [ ] **Ranger Spell Slots** — Verify both priest and wizard slots
- [ ] **Weapon Damage** — Document that simplified (single value vs. S-M/L split) or expand

## Notes

- **Agent Reports Generated**: 2026-02-27
  - See: code-review-report.md, rules-validation-report.md, css-design-review.md
  - **Security Note**: Future agent prompts should use relative paths, not absolute user paths
