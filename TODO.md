# Backdraft Forge - TODO

## Features to Add

### Share/Export
- [ ] PDF export of character sheet
- [ ] Add version field to shared character format (shareCharacter.js) for future migration

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
- [ ] Metric unit converter for character stats (height, weight, encumbrance) — PHB uses imperial, need metric reference

### Settings Panel Enhancements
- [ ] Reduce animations setting
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

- [ ] Damage Adj always shows 0 on character sheet (CombatStatsPanel:42 — hardcoded `formatModifier(0)` instead of STR damage bonus)
- [ ] Remove dead `getClericSpellsByLevel()` / `getDruidSpellsByLevel()` — marked "legacy", never called, have bugs
- [ ] `getBaseThiefSkills()` accepts `level` param but never uses it (Read Languages should be gated to level 4+)

- [ ] Settings menu animates from bottom-right, should animate from top-right (where the button is)
- [ ] d4 and d20 dice SVGs too small in gold rolling (d6 looks fine, smaller/larger dice need size adjustments)

### Light Mode Contrast
- [ ] Gold badges/warnings nearly invisible — `--gold-dark` on `--gold-overlay` is ~1.3:1 contrast
  - Affects: level limit badges, house rules tags, chip costs, alert-warning, active toggle states
- [ ] Gold text on parchment too faint — `--gold` and `--gold-dark` on `--bg` are ~2.2-2.5:1
  - Affects: final HP values in level-up, starting gold display
- [ ] `--text-faint` too light on parchment (~2.8:1) — placeholders and ability arrows hard to read
- [ ] `--text-muted` borderline on light backgrounds (~3.4:1) — section hints, card descriptions, form labels, settings text
- Root cause: light mode color variables too close to parchment background
