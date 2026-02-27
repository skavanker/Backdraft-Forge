# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AD&D 2nd Edition character creator. Browser-only, no backend.

## Tech Stack

- Svelte + Vite
- SCSS
- PDF export (likely jsPDF or similar)
- Optional AI backstory generation (provider-agnostic: Claude, OpenAI, or Ollama)

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview production build
```

## Deployment

- Hosted on Vercel (auto-deploys from `main` branch)
- Repo: https://github.com/skavanker/Backdraft-Forge
- No environment variables needed (fully static)

## Key 2E Rules (Must Enforce)

- Ability scores are rolled FIRST, then determine available races/classes
- Races have ability min/max requirements and class restrictions
- Classes have ability minimums (e.g., Paladin: STR 12, WIS 13, CHA 17)
- Warriors with 18 STR get exceptional strength (d100 roll)
- CON HP bonus above +2 is warrior-only
- Non-humans have level limits (display as info, don't block creation)
- Specialist wizard race access is derived from `wizardSchools.allowedRaces` — do NOT add `specialist` to race `classes` manually

## Character Creation Flow

1. Roll abilities (3d6 or 4d6 drop lowest) → assign to stats
2. Choose race (filtered by qualifying scores)
3. Choose class (filtered by race + scores)
4. Auto-calculate HP, THAC0, saves, AC, movement
5. Proficiencies (weapon + non-weapon)
6. Thief skills if thief (60 discretionary points)
7. Equipment (roll gold, buy gear)
8. Spells if caster
9. Optional AI backstory
10. Export (printable sheet, PDF)

## Code Organization

### CSS/SCSS Structure
- **Component styles are split into focused partials in `src/lib/styles/`**:
  - `_shared.scss` — Card patterns, selection grids, data rows (used by 3+ components)
  - `_sheet.scss` — CharacterSheet, sub-panels, menus, XP, turn undead, editable input
  - `_selectors.scss` — Race/Class/Deity/Kit selection
  - `_equipment.scss` — Equipment & gear sections
  - `_spells.scss` — Spell selection & manage mode
  - `_proficiency.scss` — Proficiency selection
  - `_levelup.scss` — Level-up wizard modal
  - `_roller.scss` — Ability rolling, dice roller, manual entry
  - `_backstory.scss` — Backstory & name entry
  - `_review.scss` — Review, summary, preview
  - `_widgets.scss` — Tooltip, SlotCounter, AbilityBadge, ImportArea, GridSection, SelectableChip
- Never inline CSS in `<style>` blocks within `.svelte` files
- Each component imports only the partials it needs: `<style lang="scss">@import './styles/shared'; @import './styles/sheet';</style>`
- `src/lib/components.module.scss` exists as a barrel file (imports all partials) but is NOT imported by components directly
- Design tokens (spacing, font sizes, border radius) are defined in `src/styles/mixins.scss`:
  - Spacing: `$space-sm` (0.5rem), `$space-md` (1rem), `$space-lg` (1.5rem)
  - Font sizes: `$text-sm` (0.875rem), `$text-base` (1rem), `$text-lg` (1.25rem)
  - Border radius: `$radius` (4px) — single value
- Generic reusable classes in `src/styles/_utilities.scss`:
  - Panels: `.panel`, `.panel-subtle`, `.panel-lg` (bg + border + rounded + padding)
  - Alerts: `.alert` + `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-danger`
- Shared utilities and mixins live in `src/styles/_utilities.scss` and `src/styles/mixins.scss`
- **Simplification over design variation**: Use existing generic classes/tokens rather than creating slight variations

### Component Extraction
- Keep components focused and single-purpose
- Extract sub-components when a component exceeds 500 lines
- Use reusable components from `src/lib/components/` directory
- Leverage state utilities from `src/lib/utils/stateUtils.svelte.js`

## Style

Parchment/fantasy aesthetic. Must look good printed.
