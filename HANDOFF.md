# BlinkMoney — "Build Your Future" · Implementation Handoff

Design phase complete. This document is the single source of truth for building the
feature. Visual reference = `/designs` (11 locked Stitch screens). Open code tasks =
[CODE-CARRYFORWARD.md](CODE-CARRYFORWARD.md). Brand evidence = extracted live from
blinkmoney.in (Mulish + Playfair Display, #0C0C0C canvas, #9FE870 accent).

---

## 1. Stack

- **Expo (SDK latest) + expo-router** (file-based routing)
- **react-native-reanimated** — all motion
- **react-native-svg** — the evolving goal illustration + icons
- **@shopify/react-native-skia** *(optional)* — only if a stroke effect needs it; prefer SVG first
- **lottie-react-native** / **rive-react-native** *(optional)* — milestone celebration only
- **react-native-safe-area-context** — safe areas
- **expo-haptics** — haptic feedback
- **Fonts**: `PlayfairDisplay_500Medium`, `Mulish_400/500/600/700` via `@expo-google-fonts`
- **State**: local component state + a lightweight store (Zustand) for the goal/session model
- No backend — all data mocked (Section 9).

---

## 2. Final screen list & routes

| # | Screen | Route | Nav type |
|---|--------|-------|----------|
| 1 | Design system (ref only, not shipped) | — | — |
| 2 | Path choice | `/build/intro` | journey |
| 3 | Freedom setup | `/build/freedom/setup` | journey |
| 4 | Freedom result | `/build/freedom/result` | landed (tab bar) |
| 5 | Dream selection | `/build/dream/select` | journey |
| 6 | Dream config | `/build/dream/config` | journey |
| 7 | Goal progress (home) | `/build/goal` | landed (tab bar) |
| 8 | Compounding moment | `/build/compounding` | journey (modal) |
| 9 | Milestone success | `/build/milestone` | journey (modal) |
| 10 | Share card | `/build/share` | modal/sheet |
| 11 | States (loading/empty/error) | per-screen variants | — |

**Journey** = header is back-chevron + step dots, NO bottom tab bar, NO "Save" title.
**Landed** = keeps BlinkMoney bottom tab bar (Home/Save/Borrow/Rewards).

---

## 3. User flow & navigation map

```
/build/intro ──choose──► Freedom ─► /build/freedom/setup ─► /build/freedom/result ┐
             └──choose──► Dream   ─► /build/dream/select ─► /build/dream/config ─► /build/goal
                                                                                    │
  /build/goal (home for an active goal) ──┬─► /build/compounding (teaching, contextual)
                                          ├─► /build/milestone (on threshold cross)
                                          └─► /build/share (from progress or milestone)
```

- Back always available (hardware back on Android maps to router back).
- Setup is **resumable**: persist a `draftGoal` in the store; on app restart, if a draft
  exists, resume at the last incomplete step; if an active goal exists, deep-link to `/build/goal`.
- Empty state (no goal) is the default content of `/build/goal`.

---

## 4. Design tokens (`theme/tokens.ts`)

```ts
export const color = {
  bg:            '#0C0C0C',
  surface1:      '#141414',
  surface2:      '#1A1A1A',
  surface3:      '#1F1F1F',
  surface4:      '#242424',
  green:         '#9FE870',   // primary accent + CTA fill
  greenBright:   '#78E137',
  greenDeep:     '#0D1F00',   // text on green buttons
  greenOnFill:   '#0C1F00',
  greenGlass:    'rgba(159,232,112,0.12)',
  greenProjected:'rgba(159,232,112,0.35)', // "future/projected" — NEVER same as actual
  borderBrand:   '#1A3300',
  borderNeutral: 'rgba(255,255,255,0.06)',
  textPrimary:   '#FFFFFF',
  textNear:      '#F3F3F3',
  textSecondary: '#808080',
  textTertiary:  '#4D4D4D',
  error:         '#FF5854',
};

export const font = {
  hero:    { family: 'PlayfairDisplay_500Medium', size: 34, lineHeight: 42, letterSpacing: -0.3 },
  sub:     { family: 'PlayfairDisplay_500Medium', size: 24, lineHeight: 32 },
  titleLg: { family: 'Mulish_700Bold',   size: 20, lineHeight: 28 },
  body:    { family: 'Mulish_400Regular', size: 16, lineHeight: 24 },
  label:   { family: 'Mulish_600SemiBold',size: 14, lineHeight: 20 },
  caption: { family: 'Mulish_500Medium',  size: 12, lineHeight: 16 },
  micro:   { family: 'Mulish_500Medium',  size: 10, lineHeight: 14, letterSpacing: 0.2 },
};

export const space  = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24, xxxl:32, huge:40 };
export const radius = { sm:4, btn:8, card:12, pill:9999 };
export const layout = { gutter:20, cardPad:16, maxContentWidth:560 }; // maxWidth caps tablets
export const motion = {
  micro:180, transition:280, teach:700, celebrate:900,
  easing: 'cubic-bezier(0.22,1,0.36,1)', // Reanimated: Easing.bezier(0.22,1,0.36,1)
};
```

Elevation = surface step + 1px border. **No shadows.**

---

## 5. Component hierarchy (`components/`)

**Primitives**
- `Screen` — SafeAreaView wrapper, bg, gutter, optional `scroll`, `maxWidth` cap.
- `JourneyHeader` — back chevron + step dots (props: `step`, `total`).
- `Text` — variant prop maps to `font.*`.
- `Button` — `primary` (green fill / greenOnFill text, weight700) | `secondary` (glass) | `ghost`. Pressed + disabled states. Min height 48.
- `Chip` — pill, selectable (unselected outline / selected greenGlass+border).
- `Card` — surface1, radius.card, borderNeutral, cardPad.
- `CurrencyInput` — ₹ prefix, large Mulish numerals, empty="0 / Zero Rupees".

**Feature**
- `ProgressMeter` — two segments: `actual` (green) + `projected` (greenProjected) + "illustrative" caption. Props: `value`, `projected`.
- `RunwayRing` — circular arc; animates sweep; count-up label. Props: `days`, `maxDays`.
- `GoalIllustration` — **the key component.** `<GoalIllustration goal="bike" progress={0..1} />`.
  Single SVG; strokes split into ordered "parts" (frame → wheel1 → wheel2 → …); parts below
  `progress*totalParts` render solid green, the rest render ghost (#4D4D4D dashed). Animates
  draw-in on mount and on progress change. Same component powers screens 6, 7, 9, 10.
- `GoalCategoryIcon` — line-art icon per goal (bike/car/trip/home/business/custom).
- `ConsistencyChip` — flame glyph + "N days of showing up" (or "N-day consistency"). Calm, no
  countdown, no "streak" wording, no reset-on-miss. (correction #3)
- `MilestoneCard` — lock icon + "unlocks at X%". X% is a progress threshold, not a part price.
- `CompoundBreakdown` — contributed / grew / total rows + stacked bar (neutral base + green cap).
- `ShareCard` — poster: % built (Playfair), consistency line, GoalIllustration, subtle wordmark.
- `TabBar` — BlinkMoney bottom nav (Home/Save/Borrow/Rewards), landed screens only.

---

## 6. Data model & store (`store/goal.ts`)

```ts
type GoalType = 'bike'|'car'|'trip'|'home'|'business'|'custom';
type Path = 'freedom'|'dream';

interface FreedomState {
  monthlyCost: number;        // ₹/month
  currentWealth: number;      // ₹
  dailyContribution: number;  // ₹/day (21|50|100 or custom)
  assumedReturnPa: number;    // e.g. 0.042 — ALWAYS labeled illustrative
}
interface DreamGoal {
  type: GoalType;
  name: string;               // "Dream Bike"
  target: number;             // ₹
  timelineYears?: number;     // optional
  currentSaved: number;       // ₹
  dailyContribution: number;  // ₹/day
  createdAt: string;
}
interface Session {
  path?: Path;
  draftGoal?: Partial<DreamGoal> | Partial<FreedomState>; // resume support
  activeGoal?: DreamGoal;
  freedom?: FreedomState;
  consistencyDays: number;    // "days of showing up"; NEVER resets to 0 on a miss (forgiving)
  contributions: { date: string; amount: number }[];
}

// Derived (pure selectors, memoized) — CURRENT figures are factual, PROJECTED are illustrative:
runwayDays          = round(currentWealth / (monthlyCost / 30));   // current coverage, derived
projectedRunwayDays(extraPerDay, years = 1)                        // ILLUSTRATIVE only
  = round((currentWealth + extraPerDay * 365 * years) / (monthlyCost / 30));
progressPct         = clamp(currentSaved / target, 0, 1);
```

### Terminology (correction #2 — do not conflate these four)
- **Portfolio wealth** — the invested amount the user holds. Factual.
- **Estimated expense coverage / runway** — `wealth ÷ daily cost`. What the hero shows.
  Copy = **"38 days of runway"** / **"38 days covered"** — NEVER "financially free for 38 days."
- **Accessible liquidity** and **borrowing capacity** — DISTINCT concepts, NOT in MVP and never
  implied by the runway number. Borrowing is a future/secondary beat (brief §8).
MVP surfaces only *portfolio wealth → expense coverage (runway)*.

### Mock data (`mocks/`) — corrected & internally consistent

Demo user is a RETURNING BlinkMoney customer with an EXISTING, pre-populated portfolio
(correction #6). Setup never asks the user to type their existing wealth — it is seeded
and read-only; the user only enters their monthly lifestyle cost.

```ts
// Seeded account (read-only in the demo)
user = { name: 'Ayush', portfolioWealth: 48133 }   // ₹ — existing invested balance

// FREEDOM fixture — monthlyCost is the ONLY user input; wealth comes from the seeded account
freedom = {
  monthlyCost: 38000,          // user-entered
  currentWealth: 48133,        // = user.portfolioWealth (seeded, not typed)
  dailyContribution: 50,       // selected chip
  assumedReturnPa: 0.042,      // ILLUSTRATIVE label required wherever used
}
// runwayDays = round(48133 / (38000/30)) = round(48133 / 1266.67) = round(38.0) = 38  ✅

// DREAM fixture — separate scenario; currentSaved also comes from existing savings, not typed
goal = { type:'bike', name:'Dream Bike', target:250000, currentSaved:72450,
         timelineYears:2, dailyContribution:21 }
// progressPct = 72450 / 250000 = 0.2898 → "29% built"  ✅

consistencyDays: 128           // rendered as "128 days of showing up"

// Milestones = MEANINGFUL PROGRESS THRESHOLDS (correction #4). They drive the illustration's
// visual evolution as a METAPHOR. A threshold is NOT a claim that X% equals the cash price of a
// specific physical part. Copy stays progress-framed ("29% built"), never "you've bought a wheel".
milestones = [
  { pct: 0.15, label: 'First wheel',   unlocked: true  },
  { pct: 0.35, label: 'Second wheel',  unlocked: false },
  { pct: 0.60, label: 'Frame & engine',unlocked: false },
  { pct: 1.00, label: 'Built',         unlocked: false },
]
```
> The demo number "38" now FALLS OUT of the math (48133 ÷ 1266.67). It is not hardcoded. If
> tokens/mock change, re-derive it — never type the string "38".

---

## 7. State specifications (per screen)

| Screen | Loading | Empty | Error | Success |
|--------|---------|-------|-------|---------|
| Freedom result | skeleton ring + shimmer | ₹0 wealth (edge, not default) → "0 days of runway — let's change that" (aspirational, CTA primary) | calc fail → quiet retry | — |
| Goal progress | ghost bike outline + shimmer, no numbers | no goal → "Your future is waiting to be built" + Start building | data fail → retry, bike stays calm outline | milestone crossed → green draw-in |
| Dream config | — | — | invalid/₹0 target → inline error, CTA disabled | goal created → route to /goal |
| Freedom setup | — | 0 input default | invalid/₹0 → inline error #FF5854, Continue disabled | — |
| Share | rendering skeleton | — | render/share fail → retry | "Shared" toast |
| Compounding | — | new user (no growth) → clearly-labeled "example" | — | — |

Global error tone: calm Mulish copy, red used only on icon/accent, never blame the user.

### Freedom flow copy & labels (corrections #2, #5, #6)
- Setup asks ONLY for **monthly cost**. `currentWealth` is **seeded from the user's existing
  portfolio** and shown read-only — the demo user does not type their wealth.
- Result hero: **"38 days of runway"** / **"38 days covered"** — never "financially free."
- **Current coverage** (the hero number) is mathematically derived and presented as factual.
- **Projected additional days** (from the ₹/day selector) must be visually distinct
  (greenProjected) and captioned **"projected · illustrative · assumed 4.2% p.a., subject to
  market risk."** Current vs projected are never blended into one figure.

---

## 8. Animation specifications

| Animation | Where | Technique | Timing |
|-----------|-------|-----------|--------|
| Goal bike draw-in | 6,7,9,10 | SVG `strokeDashoffset` per part, ordered | 800–1000ms, ease-out |
| Progress green fill grows | 7,9,10 | animate part-count / stroke color | 800ms |
| Ring sweep + day count-up | 4 | Reanimated arc + animated number | 800ms on load; 280ms on chip change |
| Runway extends on contribution | 4 | ring arc + count-up react to chip | 280ms |
| Compounding build-up | 8 | contributed bar → green segment grows on top → merge to total | 600ms/step, sequential |
| Milestone reveal | 9 | first wheel stroke-draws + fills green + one-time glow fade | 900ms, then settle |
| Card/list entrance | all | fade + translateY, staggered 60ms | 280ms |
| Chip select | all | scale 0.98 + border→green | 180ms |

Rules: transform/opacity only (60fps), no layout thrash, `useNativeDriver`/Reanimated worklets.
Every animation must *teach* (money→days, contribution→growth). No decorative confetti.
Haptics: `Haptics.selectionAsync()` on chip select; `Haptics.notificationAsync(Success)` on milestone.

---

## 9. Responsive behavior

- Design ref 390px; must hold 320px → 430px phones → 768px+ tablets.
- Flexbox + gap + %/flex widths. No absolute positioning for content (overlays only).
- Hero numbers & GoalIllustration scale to width with min/max clamps (never crop/overflow).
- `SafeAreaView` top+bottom; primary CTA above keyboard via `KeyboardAvoidingView`.
- Overflow scrolls; chip rows wrap or horizontal-scroll (fixes the "20k/38k" wrap bug).
- Tablet: cap content at `layout.maxContentWidth`, center.
- Respect OS `fontScale`; avoid fixed-height text containers.
- Test matrix: 320 / 390 / 430 / 768.

---

## 10. Edge cases

₹0 portfolio → aspirational empty, not broken · huge values → format `₹`+Indian grouping,
truncate gracefully · monthly cost > wealth → "0 days" handled calmly · contribution > income
→ gentle note, not a block · no target → CTA disabled + hint · no timeline → allowed · missed
day → consistency count does NOT reset (forgiving) · goal deleted → confirm, return to empty · goal
100% → "Built. Every rupee did this." · invalid/negative input → inline error, blocked.

---

## 11. Performance

- Memoize derived selectors; avoid recompute on every render.
- GoalIllustration: static SVG paths, animate only stroke props — don't rebuild path arrays.
- Reanimated worklets on UI thread; no JS-driven per-frame animation.
- Lazy-mount modal screens (compounding/milestone/share).
- Preload fonts before first paint (expo-splash hold).
- FlatList only where lists grow (contributions history — future).

---

## 12. Assets required

- Fonts: Playfair Display 500; Mulish 400/500/600/700.
- GoalIllustration SVGs: bike (multi-part, ordered) for MVP; car/trip/home/business as
  stretch (bike is the demoed goal). Each authored as ordered stroke groups.
- Category line-art icons (bike/car/trip/home/business/+).
- BlinkMoney wordmark (subtle, share card) + tab-bar icons.
- Optional: milestone Rive/Lottie file (else pure SVG+Reanimated).

---

## 13. Accessibility

- Min touch target 44px. Contrast: green #9FE870 on #0C0C0C passes for large text; body text
  uses white/near-white. Don't put essential meaning on color alone (built vs ghost also uses
  solid vs dashed). `accessibilityLabel`s on icon-only controls. Respect reduce-motion:
  fall back to instant states when `AccessibilityInfo.isReduceMotionEnabled`.

---

## Build order (recommended)
1. Theme + primitives (Screen, Text, Button, Chip, Card, CurrencyInput, JourneyHeader).
2. Store + mock data + selectors.
3. GoalIllustration (the linchpin) with progress-driven fill + draw-in.
4. Goal Progress screen (7) — proves the core.
5. Intro (2) → Dream select (5) → config (6) → goal (7) happy path.
6. Freedom setup (3) → result (4) with interactive runway.
7. Compounding (8), Milestone (9), Share (10).
8. States (loading/empty/error), animations pass, responsive pass, a11y + reduce-motion.

---

## 14. Final MVP approval checklist

**Correctness / math (corrections #1, #5)**
- [ ] `runwayDays` is DERIVED (`round(wealth ÷ monthlyCost/30)`), never the literal string "38".
- [ ] Freedom mock: wealth ₹48,133 + cost ₹38,000 → 38 days falls out of the formula.
- [ ] Dream mock: ₹72,450 / ₹2,50,000 → 29% falls out of the formula.
- [ ] Current coverage shown as factual; projected coverage visually distinct + "illustrative".

**Terminology (corrections #2, #3)**
- [ ] Hero uses "days of runway" / "days covered" — no "financially free" language.
- [ ] Portfolio wealth, expense coverage, liquidity, borrowing kept conceptually separate; MVP
      shows only wealth → coverage.
- [ ] Consistency uses "days of showing up" / "N-day consistency" — no "streak", no reset-on-miss.

**Milestones (correction #4)**
- [ ] Milestones are progress thresholds driving the illustration metaphor; copy never equates a
      % to the cash price of a physical part.

**Demo realism (correction #6)**
- [ ] Demo user is a returning customer with a pre-seeded, read-only portfolio.
- [ ] Freedom setup asks only for monthly cost; wealth is not manually entered.

**Compliance / trust**
- [ ] Every projected/assumed figure carries an illustrative + "subject to market risk" label.
- [ ] Borrowing is not shown or implied in MVP.

**UX / build quality (from brief rubric)**
- [ ] Nav: journey screens (2,3,5,6,8,9) have back+step-dots, no tab bar; landed (4,7) keep nav.
- [ ] `GoalIllustration` is one progress-driven SVG (fixes share + milestone green-fill).
- [ ] Category icons are clean single line-art per goal.
- [ ] Loading / empty / error / success defined and built for every key screen.
- [ ] Animations teach (draw-in, count-up, runway sweep, compounding build-up); reduce-motion
      fallback present.
- [ ] Responsive across 320 / 390 / 430 / 768; safe areas + keyboard handled; tablet width cap.
- [ ] Reusable components; memoized selectors; transform/opacity-only animation (60fps).

**Scope guard (brief §23)**
- [ ] Bike is the fully-built demo goal; other goal illustrations remain stretch, not MVP.
- [ ] No new product features added beyond this handoff.
