# Backdraft Forge - TODO

## Features to Add

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
- [ ] Reduce animations setting
- [ ] Custom starting gold multiplier

### Data Completeness
- [ ] More detailed weapon combat stats (speed factor, range, etc.)
