# Build Your Future — Fixes to handle in CODE (not Stitch)

Stitch reached its limit. The Stitch screens in `/designs` are the LOCKED visual
reference. The following were left unfinished or regressed in Stitch and MUST be
implemented correctly in the React Native build.

## A. Dream Selection — category icons
Stitch kept breaking these. In code, render ONE clean line-art icon per goal:
- Bike → full bicycle outline · Car → car outline · Trip → airplane · Home → house
  · Business → briefcase · Custom → "+"
- Use a proper icon set (e.g. lucide-react-native / phosphor) or custom SVG, thin
  stroke, green/white. Single complete icon per card, not fragments.
- Selected card = green-glass fill + 1px green border.

## B. Navigation architecture (the biggest inconsistency)
Two screen types:
- **Journey/setup screens** (Path Choice, Freedom Setup, Dream Selection, Dream
  Config, Compounding, Milestone): NO bottom tab bar, NO "Save" title. Header =
  back chevron (left) + small step-indicator dots (center).
- **Landed/persistent screens** (Freedom Result, Goal Progress): keep the
  BlinkMoney bottom tab bar (Home/Save/Borrow/Rewards).
- **Share**: present as a modal/sheet — back/close chevron, no bottom nav.

## C. The evolving bike = ONE data-driven SVG (the important one)
This is why we stopped doing it in Stitch. Build a single `<GoalIllustration
progress={0..1} />` SVG component. The "built" portion of the strokes renders solid
green #9FE870; the un-built remainder renders faint ghost grey (#4D4D4D / dashed).
- Goal Progress (Slide 7): built % green, rest ghosted — already correct visually.
- Share card (Slide 10): CURRENTLY all-faint. Must show built 29% (frame + first
  wheel) in solid green, rest ghosted.
- Milestone (Slide 9): CURRENTLY dashed ghost. The just-unlocked FIRST WHEEL must
  be solid green against the ghosted frame.
- Same component drives all three — fill bound to progress, not hand-drawn.

## D. Freedom Setup polish
- Disable "Continue" while amount is ₹0 (dim the button).
- Fix quick-pick chip wrapping (20k / 38k / 50k / 1L must not break onto 2 lines).

## E. Freedom Result
- Interactive ₹21/₹50/₹100 selector is correct — keep.
- Ring should represent the 38-day runway; relabel away from "Current Balance"
  toward the days-of-freedom concept. Keep the count-up + arc sweep animation.

## F. Global consistency (verify in code)
- Rupees (₹) everywhere, "p.a." not "APY".
- Goal named "Dream Bike" consistently.
- All projected/future values in dimmed green + "illustrative/assumed" caption.

## Animations (spec fully in handoff; built with Reanimated + optional Rive/Lottie)
- Bike stroke draw-in as progress grows (SVG stroke-dashoffset).
- Number count-ups (days, %, ₹).
- Runway ring sweep on load + on contribution change.
- Compounding: contribution bar, then green growth segment grows on top, then total.
- Milestone: single elegant green draw-in + fading glow. No confetti.
