/**
 * Demo fixtures. The demo user is a RETURNING BlinkMoney customer with an existing,
 * pre-populated portfolio (HANDOFF.md correction #6) — the user never types their wealth.
 * Numbers are chosen so the displayed results (38 days, 29%) FALL OUT of the math.
 */

import type { DreamGoal, FreedomState, GoalType, Milestone } from '@/store/goal';

/** Specific models per goal type — "which bike/car/…" the user is building toward. */
export const GOAL_MODELS: Record<GoalType, { name: string; price: number }[]> = {
  bike: [
    { name: 'City Commuter', price: 120000 },
    { name: 'Cruiser 350', price: 250000 },
    { name: 'Adventure Tourer', price: 420000 },
  ],
  car: [
    { name: 'Compact Hatchback', price: 700000 },
    { name: 'Family SUV', price: 1500000 },
    { name: 'Electric Sedan', price: 2200000 },
  ],
  home: [
    { name: 'Studio Home', price: 2500000 },
    { name: '2BHK Apartment', price: 6500000 },
    { name: 'Dream Villa', price: 15000000 },
  ],
  trip: [
    { name: 'Domestic Getaway', price: 60000 },
    { name: 'International Trip', price: 250000 },
    { name: 'World Tour', price: 900000 },
  ],
  business: [
    { name: 'Side Hustle', price: 100000 },
    { name: 'Small Studio', price: 500000 },
    { name: 'Full Launch', price: 1500000 },
  ],
  custom: [],
};

export const seededUser = {
  name: 'Ayush',
  portfolioWealth: 48133, // ₹ existing invested balance (seeded, read-only)
};

/** Freedom fixture: monthlyCost is the only user input; wealth comes from the seeded account. */
export const seededFreedom: FreedomState = {
  monthlyCost: 38000,
  currentWealth: seededUser.portfolioWealth, // 48133 -> runwayDays = 38
  dailyContribution: 50,
  assumedReturnPa: 0.042, // ILLUSTRATIVE wherever shown
};

/** Dream fixture: currentSaved comes from existing savings, not typed. 72450/250000 = 29%. */
export const seededGoal: DreamGoal = {
  type: 'bike',
  name: 'Cruiser 350',
  target: 250000,
  timelineYears: 2,
  currentSaved: 72450,
  dailyContribution: 342, // realistic daily SIP for a ₹2.5L goal over ~2 years
  createdAt: '2026-04-06T00:00:00.000Z',
};

export const seededConsistencyDays = 128; // "128 days of showing up" — never resets on a miss

/**
 * Milestones are MEANINGFUL PROGRESS THRESHOLDS (correction #4) that drive the illustration's
 * visual evolution as a metaphor. A threshold is NOT the cash price of a physical part.
 */
export const seededMilestones: Milestone[] = [
  { pct: 0.1, label: 'Off the blocks', unlocked: false },
  { pct: 0.25, label: 'A quarter built', unlocked: false },
  { pct: 0.5, label: 'Halfway there', unlocked: false },
  { pct: 0.75, label: 'Three quarters built', unlocked: false },
  { pct: 1.0, label: 'Fully built', unlocked: false },
];

/** Illustrative long-term return for the compounding explainer (multi-asset investing). */
export const assumedGrowthPa = 0.12; // 12% p.a. — ASSUMED, not guaranteed
export const compoundingHorizons = [1, 5, 10, 20]; // years

/** 20-second investing micro-lessons for the Daily Money Moment. Rotates by day. */
export const dailyLessons: { title: string; body: string }[] = [
  {
    title: 'Time beats timing',
    body: "You don't need to pick the perfect moment to invest. Staying invested longer matters far more than trying to time the market.",
  },
  {
    title: 'Small and regular wins',
    body: '₹100 every day beats ₹3,000 once a year. Investing little and often smooths out the market’s ups and downs.',
  },
  {
    title: 'Growth earns growth',
    body: 'Your returns earn their own returns — that’s compounding. It starts slow, then speeds up the longer you stay.',
  },
  {
    title: "Don't fear the dips",
    body: 'Markets fall sometimes. Long-term investors who stay put have historically recovered and grown past the fall.',
  },
  {
    title: 'Spread your eggs',
    body: 'Holding stocks, gold and FD together lowers risk. BlinkMoney spreads your money across them automatically.',
  },
  {
    title: 'The best day is today',
    body: 'The best time to start was years ago. The second best is today — time is the biggest advantage you have.',
  },
];

export const contributionOptions = [21, 50, 100]; // ₹/day chips (freedom)
export const addAmountPresets = [21, 100, 500, 1000]; // flexible top-up amounts
export const monthlyCostQuickPicks = [20000, 38000, 50000, 100000];
