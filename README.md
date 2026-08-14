# BlinkMoney — Build Your Future

A new BlinkMoney feature that turns *"you invested ₹X"* into something you can **see and feel**:
**your money building your future.** Built in React Native (Expo) as a frontend product slice.

> **Core idea:** money → progress → a future you can watch take shape.

## The experience

The user chooses what they're investing for:

- **Build a dream** — pick a goal (Bike / Car / Trip / Home / Business / Custom) and a specific model,
  then watch that goal's silhouette **fill with green as you save**, hit milestones, and understand
  compounding.
- **Build my freedom** — translate your portfolio into **days of runway** ("38 days covered"),
  and see how investing a little each day extends it.

Supporting screens: an interactive **compounding** explainer (your money vs. its growth over
1/5/10/20 years), **insights** (pace, projected finish, days to goal), a daily **money moment**
(overnight growth + a 20-second lesson), **milestones**, and a shareable **achievement card**.

## Tech

- **Expo (SDK 57) + expo-router** (file-based routing)
- **react-native-reanimated** + **react-native-svg** — all motion and the goal illustration
- **Zustand** — single source of truth; every displayed number is derived via selectors (`src/store/selectors.ts`)
- **@expo-google-fonts** — Playfair Display (editorial headlines) + Mulish (UI)
- Fully mocked/local data — no backend.

## Run it

```bash
cd mobile
npm install
npm run web      # opens in the browser (mobile-width; use device mode / a phone)
# or: npm start  # then scan the QR with Expo Go, or run on an emulator
```

The app opens on **"What are you building toward?"** — pick a path and go. A subtle
**"Reset demo journey"** link on that first screen lets you replay both flows.

## Two demo flows

**Dream:** Build a dream → Bike → Cruiser 350 → configure → Goal dashboard → Add money
(watch progress animate) → Milestone → Insights → Compounding → Share.

**Freedom:** Build my freedom → enter monthly cost → Runway result (interactive ₹/day) →
"See how investing helps" (compounding).

## Design process (this repo tells the whole story)

- `designs/` — the design exploration (BlinkMoney brand extracted from the live site, then screen designs)
- `HANDOFF.md` — the implementation handoff spec (tokens, components, states, animations, data model)
- `CODE-CARRYFORWARD.md` — decisions carried from design into code

## Design principles

Premium, calm, trustworthy — BlinkMoney's dark canvas + green accent + serif/sans pairing.
Meaningful motion over decoration. Forgiving consistency (never punishing). Projections always
labeled *illustrative / not guaranteed* — no financial promises.
