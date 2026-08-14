# BlinkMoney — Build Your Future

A React Native (Expo) vertical slice that turns money into visible progress:
money → progress → visible future → consistency → understanding compounding.

Design reference: `../designs` (locked Stitch screens). Spec: `../HANDOFF.md`.

## Run it

```bash
npm install
npm start          # then press 'a' (Android), 'w' (web), or scan the QR in Expo Go
# or
npm run web        # fastest to preview in a browser
```

## What's built

Full flow, both paths, all states:

- **Intro** — "What are you building toward?" (Freedom / Dream)
- **Freedom** — monthly-cost setup → runway result ("38 days of runway") with an
  interactive ₹/day selector that extends the projected (dim-green) arc
- **Dream** — goal grid → **model picker** (which bike/car) → config → **Goal Progress** (anchor)
- **Goal shape fills** — a solid silhouette of the chosen goal fills with green from the bottom
  as you save (data-driven, per goal type)
- **Add money** — flexible top-up sheet (₹21/₹100/₹500/₹1,000 or any custom amount)
- **Daily Money Moment** — a calm daily-return ritual: overnight growth (+₹X your money earned),
  a forgiving consistency count, and a rotating 20-second investing micro-lesson. Drives daily
  engagement + education without gamification (no XP/leaderboards/streaks-that-punish)
- **Insights** — projected finish date, on-pace status, daily/monthly pace, days-to-goal
- **Interactive compounding** — personalized: set your daily amount + horizon (1/5/10/20 yrs) and
  see how much you put in vs how much your money earns on its own
- **Compounding** — the "your money did that" teaching moment
- **Milestone** — calm green reveal at each progress threshold
- **Share** — poster card with the built-in-green illustration
- **States** — live Loading skeleton on the dashboard; Empty + Error components

## Architecture

```
src/
  theme/tokens.ts        design tokens (colors, type, spacing, motion)
  lib/calc.ts            pure, tested-by-eye financial math (runway, %, ₹ format)
  mocks/index.ts         seeded returning-user fixtures
  store/goal.ts          zustand session store (draft + active goal, contributions)
  components/            primitives + feature components
    GoalIllustration     ← the linchpin: one progress-driven SVG (built=green, rest=ghost)
    RunwayRing, ProgressArc, ProgressMeter, CompoundBreakdown, ShareCard, ...
    states/              GoalLoading / GoalEmpty / GoalError
  app/                   expo-router routes (see HANDOFF §2)
```

## Key correctness notes

- Runway (38) and progress (29%) are **derived from the math**, never hardcoded.
- CURRENT figures are factual; PROJECTED figures are dim-green + "illustrative /
  assumed / subject to market risk".
- "Days of runway" (not "financially free"); "days of showing up" (not "streak",
  never resets on a miss). Borrowing is intentionally out of scope.

See `../CODE-CARRYFORWARD.md` for the Stitch-limitations this build resolved.
