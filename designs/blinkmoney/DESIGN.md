---
name: BlinkMoney
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c1cab5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8b9481'
  outline-variant: '#41493a'
  surface-tint: '#91d963'
  primary: '#d0ffad'
  on-primary: '#153800'
  primary-container: '#9fe870'
  on-primary-container: '#2e6900'
  inverse-primary: '#2f6c00'
  secondary: '#76df35'
  on-secondary: '#143800'
  secondary-container: '#53b900'
  on-secondary-container: '#194200'
  tertiary: '#ffecf0'
  on-tertiary: '#4a2533'
  tertiary-container: '#ffc5d7'
  on-tertiary-container: '#7b4f5e'
  error: '#FF5854'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acf67c'
  primary-fixed-dim: '#91d963'
  on-primary-fixed: '#092100'
  on-primary-fixed-variant: '#225100'
  secondary-fixed: '#91fc50'
  secondary-fixed-dim: '#76df35'
  on-secondary-fixed: '#092100'
  on-secondary-fixed-variant: '#215100'
  tertiary-fixed: '#ffd9e3'
  tertiary-fixed-dim: '#f0b7c9'
  on-tertiary-fixed: '#31101e'
  on-tertiary-fixed-variant: '#643a49'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-low: '#141414'
  surface-med: '#1A1A1A'
  surface-high: '#1F1F1F'
  surface-highest: '#242424'
  green-glass: rgba(159,232,112,0.12)
  deep-green: '#0D1F00'
  border-brand: '#1A3300'
  border-neutral: rgba(255,255,255,0.06)
  text-primary: '#FFFFFF'
  text-near-white: '#F3F3F3'
  text-secondary: '#808080'
  text-tertiary: '#4D4D4D'
typography:
  hero:
    fontFamily: Playfair Display
    fontSize: 34px
    fontWeight: '500'
    lineHeight: 42px
    letterSpacing: -0.01em
  sub-headline:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  title-lg:
    fontFamily: Mulish
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-md:
    fontFamily: Mulish
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Mulish
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  caption:
    fontFamily: Mulish
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  micro:
    fontFamily: Mulish
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  gutter: 20px
  card-padding: 16px
---

## Brand & Style
This design system establishes an **Editorial Fintech** aesthetic, positioning financial management as a calm, premium, and emotionally intelligent experience. The narrative moves away from traditional "gamified" fintech tropes, favoring a sophisticated, high-contrast, and structured environment.

The visual direction is **Minimalist-Modern with Editorial flourishes**. It utilizes a deep canvas and "quiet" elevations to evoke a sense of security and focus. The combination of high-end serif headlines and functional sans-serif body text creates a "Build Your Future" narrative—blending the authority of traditional banking with the agility of modern technology.

**Design Principles:**
- **Calm over Chaos:** No shadows, no unnecessary gradients, and no aggressive animations.
- **Intentional Contrast:** Vibrant primary accents are used sparingly to guide actions against a deep neutral backdrop.
- **Structured Precision:** A strict 4pt grid system ensures every element feels deliberate and architecturally sound.

## Colors
The palette is rooted in a deep dark-mode architecture. The **Canvas (#0C0C0C)** acts as the bedrock, with incremental surface steps providing hierarchy without the need for drop shadows. 

**Usage Guidelines:**
- **Primary Green:** Reserved exclusively for high-priority CTAs and critical status indicators. It should never be used for large backgrounds.
- **Glass Effects:** Use `green-glass` for subtle highlight areas or secondary containers to provide a sense of depth and translucency over darker surfaces.
- **Borders:** Use `border-neutral` for standard structural separation. Reserve `border-brand` for active states or specifically highlighting premium financial products.
- **Typography:** Always maintain high legibility by using `text-primary` for headlines and `text-secondary` for supporting metadata.

## Typography
The typography system uses a dual-family approach to balance editorial elegance with functional clarity. 

- **Playfair Display** is used for emotive, high-level storytelling. It should be typeset with slightly tighter tracking for headlines to maintain a premium "magazine" feel.
- **Mulish** (substituted for Source Sans 3 for broad compatibility) handles all functional, data-heavy, and interactive elements. It is chosen for its geometric clarity and readability at small scales.
- **Hierarchy:** Ensure there is significant whitespace around `hero` and `sub-headline` levels to let the serif letterforms "breathe."

## Layout & Spacing
The design system follows a rigid **4pt Grid System**. This ensures mathematical harmony across all components.

- **Mobile Layout:** 
  - 20px outside margins (Gutter).
  - Vertical stacking is the primary flow.
  - Card components utilize 16px internal padding to balance density and readability.
- **Rhythm:** Use `32px` (3xl) or `40px` (4xl) to separate major sections of content. Use `8px` (sm) or `12px` (md) for internal element grouping (e.g., a label above an input).
- **Alignment:** All text should be left-aligned to maintain the editorial structure. Avoid centered text except for primary empty state icons or specific splash screens.

## Elevation & Depth
This design system rejects traditional box shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**.

- **Depth Strategy:** Depth is communicated by "stepping up" the brightness of the surface. A card sitting on the `Canvas (#0C0C0C)` should use `Surface-Low (#141414)`. A modal or popover sitting on top of that card should use `Surface-High (#1F1F1F)`.
- **Borders as Dividers:** Use the `border-neutral` (6% white) for almost all containers. This creates a subtle, "etched" look that feels premium and tactile without being heavy.
- **Backdrop Blur:** Use a subtle blur on sticky navigation bars or overlays to maintain context of the background content while ensuring legibility.

## Shapes
The shape language is controlled and sophisticated.

- **Cards:** Use a consistent `12px` (rounded-lg) radius. This provides a soft, approachable feel while remaining structured.
- **Buttons:** Use a tighter `8px` (rounded-md) radius. This differentiates interactive elements from static containers.
- **Chips/Badges:** Use a **Full Pill** radius. These should be visually distinct from buttons to indicate they are informational or removable tags rather than primary actions.
- **Inputs:** Match the button radius (8px) for a unified interactive language.

## Components
Consistent styling across the ecosystem is maintained through these component-specific rules:

- **Buttons:** 
  - Primary: `Primary Green` background with `#0D1F00` (Deep Green) text. 8px radius.
  - Secondary: `Green-glass` background with `Primary Green` text. 8px radius.
  - Tertiary: Ghost style (no background) with `Primary Green` text.
- **Cards:** 
  - Background: `Surface-Low` or `Surface-Med`.
  - Border: 1px solid `border-neutral`. 12px radius. 16px internal padding.
- **Inputs:**
  - Background: `Surface-High`. 
  - Border: 1px solid `border-neutral`.
  - Focused State: Border changes to `border-brand` (#1A3300).
- **Chips:**
  - Full pill shape.
  - Background: `Surface-highest` or `Green-glass` for active states.
  - Text: `Label-sm` typography.
- **Lists:**
  - Separated by `border-neutral` 1px lines. 
  - Leading icons should be encased in a 40x40px `Surface-Med` circle or soft-square.
- **Progress Bars:**
  - Track: `Surface-highest`.
  - Indicator: `Primary Green`. No rounded caps on the indicator for a more "data-precise" look.