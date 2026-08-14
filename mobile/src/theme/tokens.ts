/**
 * BlinkMoney — Build Your Future design tokens.
 * Values extracted from live blinkmoney.in (see project HANDOFF.md §4).
 * Elevation = surface step + 1px border. No shadows.
 */

export const color = {
  bg: '#0C0C0C',
  surface1: '#141414',
  surface2: '#1A1A1A',
  surface3: '#1F1F1F',
  surface4: '#242424',

  green: '#9FE870', // primary accent + CTA fill
  greenBright: '#78E137',
  greenDeep: '#0D1F00',
  greenOnFill: '#0C1F00', // text on green buttons
  greenGlass: 'rgba(159,232,112,0.12)',
  greenProjected: 'rgba(159,232,112,0.35)', // "future/projected" — never same as actual

  borderBrand: '#1A3300',
  borderNeutral: 'rgba(255,255,255,0.06)',

  textPrimary: '#FFFFFF',
  textNear: '#F3F3F3',
  textSecondary: '#808080',
  textTertiary: '#4D4D4D',

  error: '#FF5854',
} as const;

export const font = {
  hero: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 34, lineHeight: 42, letterSpacing: -0.3 },
  sub: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 24, lineHeight: 32 },
  titleLg: { fontFamily: 'Mulish_700Bold', fontSize: 20, lineHeight: 28 },
  body: { fontFamily: 'Mulish_400Regular', fontSize: 16, lineHeight: 24 },
  label: { fontFamily: 'Mulish_600SemiBold', fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: 'Mulish_500Medium', fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: 'Mulish_500Medium', fontSize: 10, lineHeight: 14, letterSpacing: 0.2 },
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 } as const;
export const radius = { sm: 4, btn: 8, card: 12, pill: 9999 } as const;
export const layout = { gutter: 20, cardPad: 16, maxContentWidth: 560 } as const;

export const motion = {
  micro: 180,
  transition: 280,
  teach: 700,
  celebrate: 900,
  // Reanimated: Easing.bezier(0.22, 1, 0.36, 1)
  easing: [0.22, 1, 0.36, 1] as const,
};

export type FontVariant = keyof typeof font;
