# Backdraft Forge - TODO

## Bugs

### Languages (needs PHB verification before fixing)
- [ ] **INT bonus language slots wrong** — `getBonusLanguageSlots()` in `languages.js` caps at 4 slots (INT 16+) and gives 0 for INT 8-12. `mechanics.js` has a separate table that looks correct (INT 8=1, INT 10=2, INT 18=7). Two sources agree — likely safe to fix by using `getIntelligenceModifiers(INT).languages` in ProficiencySelector instead. **Verify: PHB Table 4 p.16**
- [ ] **Gnome auto-languages incomplete** — AI validator says PHB p.25 gives gnomes Common + Gnomish + Dwarvish + Halfling automatically. We only give Common + Gnomish. **Verify before fixing.**
- [ ] **Halfling auto-languages incomplete** — AI validator says PHB p.27 gives halflings Common + Halfling + Gnomish automatically. We only give Common + Halfling. **Verify before fixing.**

## Features to Add

### Share/Export
- [ ] PDF export of character sheet
- [ ] Full JSON export/import option
  - Share URL (current) only stores keys, loses items if data changes
  - JSON export should store complete item data (name, stats, etc.) for robustness
  - Allows characters to survive equipment/spell data changes between versions
  - User can choose: Quick URL share (compact, potentially lossy) vs JSON file (complete, bulletproof)
- [ ] Do research if another like char fil excist other places and maybe use same format.

### UX

### Visuals
- [ ] Class icons for more places (character sheet header, NPC generator)
- [ ] Race icons (Dwarf, Elf, Gnome, Half-Elf, Halfling, Human)
- [ ] Logo cleanup (remove off-artboard paths)

### AI Integration
- [ ] AI-generated backstory (provider-agnostic)

### Gameplay Additions
- [ ] Multi-classing support (demi-humans advance in 2+ classes simultaneously)
- [ ] Dual-classing for humans (switch class, start over at level 1)

### Tools
- [ ] THAC0 calculator

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

#### Monster Bestiary
- [ ] Random encounter generator (by terrain/dungeon level)
- [ ] Export/print functionality for stat blocks
- [ ] Tie to treasure generator (each monster has a Treasure Type)

#### Name Generator - Future Enhancements
- [ ] **Additional name types** — Dragon, Demon/Devil, Deity, Guild/Organization, Ship, Magic item names
- [ ] **More training data** — bump each chain from ~65 to ~120 names for better Markov variety; gnome and halfling chains are thinnest

### Settings Panel Enhancements
- [ ] Custom starting gold multiplier
- Wait for settings feature to land before planning more — house rules stuff should live there

### Build
- [ ] **Dynamic/static import conflicts** — `deities.js`, `spells.js`, `kits.js`, `languages.js`, `priestSpells.js`, `treasureGenerator.js` are statically imported by components but also dynamically imported by `shareCharacter.js` / `characterRestore.svelte.js`. Vite warns the dynamic split is voided by the static import. Fix: make all imports of these modules dynamic, or accept the current behaviour since the files are needed on load anyway

### Code Cleanup / Consolidation
- [ ] **Merge NPCStatBlock + MonsterStatBlock** — same card layout (name, combat stats row, abilities, action bar); NPC has 3 combat stats, monster has 5, but structure is identical — merge into one `<StatBlock>` with slots
