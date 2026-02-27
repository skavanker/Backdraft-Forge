# Backdraft Forge - TODO

## Features to Add

### Share/Export
- [ ] PDF export of character sheet
- [ ] Ctrl+e to export

### Visuals
- [ ] Remaining portraits (16 Half-Elf and Halfling combinations)
- [ ] Use d4/d20 dice SVGs for HP rolling and other contexts

### AI Integration
- [ ] AI-generated backstory (provider-agnostic)
- [ ] AI portrait generation (optional alternative to manual portraits)

### Gameplay Additions
- [ ] Multi-classing support (demi-humans advance in 2+ classes simultaneously)
- [ ] Dual-classing for humans (switch class, start over at level 1)
- [ ] Ranger species enemy selection

### UI/UX
- [ ] Mobile responsiveness improvements
- [ ] Metric converter

### Data Completeness
- [ ] More equipment options
- [ ] More detailed weapon combat stats (speed factor, range, etc.)

## Refactoring Backlog

### Medium Priority
- [ ] Spell Management Service — consolidate spell filtering/availability logic (~150 lines)
- [ ] Alignment/Deity Restriction Logic — unified filtering for ClassSelector, BackstoryEditor, CharacterSheet (~30-40 lines)

### Low Priority
- [ ] Form Submission Patterns — standardize `onComplete` callback signatures (~20-30 lines)
