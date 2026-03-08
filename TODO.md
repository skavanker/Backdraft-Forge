# Backdraft Forge - TODO

## Bugs

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
- [ ] Hide the "start over" (×) button when there's nothing to reset — e.g. on the splash page, or at step 0 with no rolled abilities yet

### Visuals
- [ ] Class icons for more places (character sheet header, NPC generator)
- [ ] Race icons (Dwarf, Elf, Gnome, Half-Elf, Halfling, Human)
- [ ] Logo cleanup (remove off-artboard paths)

### AI Integration
- [ ] AI-generated backstory (provider-agnostic)

### Gameplay Additions
- [ ] Multi-classing support (demi-humans advance in 2+ classes simultaneously)
- [ ] Dual-classing for humans (switch class, start over at level 1)
- [ ] Starting age should include class modifier per PHB Table 10 (e.g., wizards add 2d8, fighters add 1d4) — currently only uses base racial range. Update tooltip text to show the class modifier breakdown (e.g., "Human Fighter: 16-25 base + 1d4 class modifier")
- [ ] Research and enforce kit alignment restrictions — Berserker says "Must be Chaotic", Assassin says "Must be Evil", but need to verify against PHB/Complete Handbook sources. Check if other kits or base classes have alignment restrictions too (e.g., Ranger, Druid, Bard). Currently just flavor text in `restrictions` array, not enforced

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
- [ ] Remove "unsaved changes" warning when navigating away — bestiary has no saveable state

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
- [ ] **Merge NPCList + MonsterList** — both are section-header + grid-lg + stat block loop; extract one `<ItemList>` component
- [ ] **CSS `.stat` utility** — `.stat { flex-column; .label; .value }` is defined separately in `_npc-components.scss` and `_monster-bestiary.scss`; move to `_utilities.scss`
- [ ] **Generator page wrapper** — NPCGenerator, TreasureGenerator, NameGenerator share the same outer shell (header, form section, loading state, results section, saved section, empty state); extract `<GeneratorPage>` wrapper
