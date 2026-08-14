/**
 * Pure, memoizable financial calculations for Build Your Future.
 * CURRENT figures are factual; PROJECTED figures are illustrative (see HANDOFF.md §6).
 * Nothing here hardcodes demo numbers — the "38 days" / "29%" fall out of the math.
 */

const DAYS_PER_MONTH = 30;

/** Current expense coverage in days = wealth ÷ daily cost. Factual. */
export function runwayDays(currentWealth: number, monthlyCost: number): number {
  if (monthlyCost <= 0) return 0;
  return Math.round(currentWealth / (monthlyCost / DAYS_PER_MONTH));
}

/**
 * ILLUSTRATIVE projected coverage if the user adds `extraPerDay` for `years`.
 * Contributions only (conservative); returns are disclosed separately and labeled assumed.
 */
export function projectedRunwayDays(
  currentWealth: number,
  monthlyCost: number,
  extraPerDay: number,
  years = 1,
): number {
  if (monthlyCost <= 0) return 0;
  const projectedWealth = currentWealth + extraPerDay * 365 * years;
  return Math.round(projectedWealth / (monthlyCost / DAYS_PER_MONTH));
}

/** Additional illustrative days gained from a contribution level, vs current coverage. */
export function extraRunwayDays(
  currentWealth: number,
  monthlyCost: number,
  extraPerDay: number,
  years = 1,
): number {
  return projectedRunwayDays(currentWealth, monthlyCost, extraPerDay, years) - runwayDays(currentWealth, monthlyCost);
}

/** Goal progress as a 0..1 fraction. */
export function progressPct(currentSaved: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(Math.max(currentSaved / target, 0), 1);
}

/** Whole-percent for display, e.g. 0.2898 -> 29. */
export function progressPercentLabel(currentSaved: number, target: number): number {
  return Math.round(progressPct(currentSaved, target) * 100);
}

/** Days needed to reach the goal at a given daily pace. */
export function daysToGoal(currentSaved: number, target: number, perDay: number): number {
  if (perDay <= 0) return Infinity;
  return Math.max(Math.ceil((target - currentSaved) / perDay), 0);
}

/** Projected completion date from today at the current daily pace. */
export function projectedCompletionDate(currentSaved: number, target: number, perDay: number): Date {
  const days = daysToGoal(currentSaved, target, perDay);
  const d = new Date();
  if (!Number.isFinite(days)) return d;
  d.setDate(d.getDate() + days);
  return d;
}

/** e.g. "Mar 2029" */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

/** Human duration from a number of days, e.g. "~2.4 years" or "~7 months". */
export function formatDuration(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return '—';
  const years = days / 365;
  if (years >= 1) return `~${years.toFixed(years < 10 ? 1 : 0)} years`;
  const months = Math.max(Math.round(days / 30), 1);
  return `~${months} ${months === 1 ? 'month' : 'months'}`;
}

/** Years (float) to reach target from zero at a daily amount. */
export function yearsToBuild(target: number, perDay: number): number {
  if (perDay <= 0) return Infinity;
  return target / (perDay * 365);
}

/** Total you actually put in over the period (contributions only). */
export function investedTotal(dailyAmount: number, years: number): number {
  return dailyAmount * 365 * years;
}

/**
 * Future value of a daily SIP compounded monthly at an assumed annual rate. ILLUSTRATIVE.
 * Modelled as a monthly SIP so returns earn returns — that's the compounding.
 */
export function futureValueSIP(dailyAmount: number, years: number, annualRate: number): number {
  const monthly = (dailyAmount * 365) / 12;
  const i = annualRate / 12;
  const n = Math.round(years * 12);
  if (i === 0) return monthly * n;
  return monthly * ((Math.pow(1 + i, n) - 1) / i);
}

/** Illustrative one-day earnings on an invested amount. */
export function dailyEarnings(amount: number, annualRate: number): number {
  return (amount * annualRate) / 365;
}

/** Deterministic index that advances once per day (for rotating daily content). */
export function dayIndex(): number {
  return Math.floor(Date.now() / 86400000);
}

/** The part that is pure growth (your money earning, not you contributing). */
export function compoundGrowth(dailyAmount: number, years: number, annualRate: number): number {
  return Math.max(futureValueSIP(dailyAmount, years, annualRate) - investedTotal(dailyAmount, years), 0);
}

/** Indian-grouping currency, e.g. 250000 -> "₹2,50,000". */
export function formatINR(amount: number): string {
  const n = Math.round(amount);
  const sign = n < 0 ? '-' : '';
  const s = Math.abs(n).toString();
  if (s.length <= 3) return `${sign}₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${sign}₹${grouped},${last3}`;
}

/** Compact rupees for chips, e.g. 20000 -> "20k", 100000 -> "1L". */
export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) return `${+(amount / 10000000).toFixed(amount % 10000000 ? 1 : 0)}Cr`;
  if (amount >= 100000) return `${+(amount / 100000).toFixed(amount % 100000 ? 1 : 0)}L`;
  if (amount >= 1000) return `${+(amount / 1000).toFixed(amount % 1000 ? 1 : 0)}k`;
  return `${amount}`;
}
