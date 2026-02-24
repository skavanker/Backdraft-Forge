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

## Style

Parchment/fantasy aesthetic. Must look good printed.
