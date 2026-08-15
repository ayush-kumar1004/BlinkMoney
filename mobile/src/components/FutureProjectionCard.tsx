import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from './Text';
import { Card } from './Card';
import { Chip } from './Chip';
import { Stepper } from './Stepper';
import { Icon } from './Icon';
import { AnimatedNumber } from './AnimatedNumber';
import { InfoNote } from './InfoNote';
import type { DreamGoal } from '@/store/goal';
import {
  investedTotal,
  futureValueSIP,
  projectedBalance,
  monthsToReachTarget,
  formatMonthsDuration,
  dateFromMonths,
  formatMonthYear,
  formatINR,
} from '@/lib/calc';
import { color as C, radius, space } from '@/theme/tokens';

const CONTRIB_PRESETS = [100, 500, 1000, 2000];
const HORIZONS = [1, 3, 5, 10];
const RATES = [
  { v: 0.08, label: 'Conservative' },
  { v: 0.1, label: 'Balanced' },
  { v: 0.12, label: 'Growth' },
];
const MIN = 50;
const MAX = 10000;

/** "Fast-Forward Your Future" — connects today's contribution to projected value and the goal. */
export function FutureProjectionCard({ goal }: { goal: DreamGoal }) {
  const [contribution, setContribution] = useState(
    Math.min(Math.max(Math.round((goal.dailyContribution || 1000) / MIN) * MIN, MIN), MAX),
  );
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(0.1);

  const m = useMemo(() => {
    const totalContribution = investedTotal(contribution, years);
    const projectedValue = futureValueSIP(contribution, years, rate); // contributions only
    const growth = Math.max(projectedValue - totalContribution, 0);
    const growthShare = projectedValue > 0 ? growth / projectedValue : 0;

    // Goal connection uses FULL balance (current savings + contributions), starting from actual savings.
    const balance = projectedBalance(goal.currentSaved, contribution, years, rate);
    const months = monthsToReachTarget(goal.currentSaved, goal.target, contribution, rate);
    const withinHorizon = Number.isFinite(months) && months <= years * 12;
    const shortfall = Math.max(goal.target - balance, 0);

    return { totalContribution, projectedValue, growth, growthShare, balance, months, withinHorizon, shortfall };
  }, [contribution, years, rate, goal.currentSaved, goal.target]);

  const alreadyReached = goal.currentSaved >= goal.target;
  const timeStr = formatMonthsDuration(m.months);
  const targetDate = Number.isFinite(m.months) ? formatMonthYear(dateFromMonths(m.months)) : null;

  // Animated growth portion of the split bar.
  const growthW = useSharedValue(m.growthShare);
  useEffect(() => {
    growthW.value = withTiming(m.growthShare, { duration: 450, easing: Easing.out(Easing.cubic) });
  }, [m.growthShare, growthW]);
  const barStyle = useAnimatedStyle(() => ({ width: `${growthW.value * 100}%` }));

  return (
    <Card style={styles.card}>
      <Text variant="micro" color={C.green} style={styles.eyebrow}>
        FAST-FORWARD YOUR FUTURE
      </Text>
      <Text variant="titleLg" style={styles.title}>
        See what your money could become
      </Text>

      {/* Contribution */}
      <Text variant="label" color={C.textSecondary} style={styles.fieldLabel}>
        Your daily contribution
      </Text>
      <Stepper value={contribution} onChange={setContribution} min={MIN} max={MAX} step={50} format={(v) => `${formatINR(v)} / day`} />
      <View style={styles.chips}>
        {CONTRIB_PRESETS.map((v) => (
          <Chip key={v} label={formatINR(v)} selected={contribution === v} onPress={() => setContribution(v)} />
        ))}
      </View>

      {/* Horizon */}
      <Text variant="label" color={C.textSecondary} style={styles.fieldLabel}>
        Over
      </Text>
      <View style={styles.rowChips}>
        {HORIZONS.map((y) => (
          <Chip key={y} label={`${y}Y`} selected={years === y} onPress={() => setYears(y)} style={styles.flexChip} />
        ))}
      </View>

      {/* Illustrative return (subtle) */}
      <Text variant="label" color={C.textSecondary} style={styles.fieldLabel}>
        Illustrative return
      </Text>
      <View style={styles.rowChips}>
        {RATES.map((r) => (
          <Chip key={r.v} label={`${Math.round(r.v * 100)}%`} selected={rate === r.v} onPress={() => setRate(r.v)} style={styles.flexChip} />
        ))}
      </View>
      <Text variant="caption" color={C.textSecondary} style={styles.rateNote}>
        {RATES.find((r) => r.v === rate)?.label} · illustrative assumption, actual returns vary.
      </Text>

      {/* Three numbers — projected value dominant */}
      <View style={styles.result}>
        <View style={styles.smallRow}>
          <Text variant="body" color={C.textSecondary}>
            You put in
          </Text>
          <AnimatedNumber value={m.totalContribution} variant="titleLg" duration={600} format={formatINR} />
        </View>
        <View style={styles.smallRow}>
          <Text variant="body" color={C.textSecondary}>
            Illustrative growth
          </Text>
          <AnimatedNumber value={m.growth} variant="titleLg" color={C.green} duration={600} format={(n) => `+${formatINR(n)}`} />
        </View>
        <View style={styles.divider} />
        <Text variant="label" color={C.textSecondary}>
          Projected value
        </Text>
        <AnimatedNumber value={m.projectedValue} color={C.green} duration={700} format={formatINR} style={styles.projected} />

        {/* Minimal split bar: contribution (neutral) vs growth (green) */}
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barGrowth, barStyle]} />
        </View>
        <View style={styles.legend}>
          <Text variant="caption" color={C.textSecondary}>
            You added {Math.round((1 - m.growthShare) * 100)}%
          </Text>
          <Text variant="caption" color={C.green}>
            Growth {Math.round(m.growthShare * 100)}%
          </Text>
        </View>
      </View>

      {/* Goal connection */}
      <View style={styles.goalBox}>
        <View style={styles.goalHead}>
          <Text variant="micro" color={C.textSecondary} style={styles.goalEyebrow}>
            YOUR GOAL
          </Text>
          <Text variant="micro" color={C.textSecondary}>
            {goal.name} · {formatINR(goal.target)}
          </Text>
        </View>
        <View style={styles.verdict}>
          <Icon
            name={alreadyReached || m.withinHorizon ? 'trending-up' : 'info'}
            size={16}
            color={alreadyReached || m.withinHorizon ? C.green : C.textSecondary}
          />
          <Text variant="body" color={C.textNear} style={styles.verdictText}>
            {alreadyReached
              ? "You've already reached your goal — every rupee from here is a head start."
              : Number.isFinite(m.months)
                ? m.withinHorizon
                  ? `At this pace, your goal could be reached in about ${timeStr} — around ${targetDate}, within your ${years}-year view.`
                  : `At this pace, your goal could be reached in about ${timeStr} (around ${targetDate}) — a little beyond your ${years}-year view. A higher daily amount could bring it closer.`
                : `At this pace, the goal extends beyond a long horizon. Increasing your daily amount would bring it within reach.`}
          </Text>
        </View>
      </View>

      <View style={styles.note}>
        <InfoNote>Illustrative projection only. Actual returns vary and are not guaranteed.</InfoNote>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: space.xl },
  eyebrow: { letterSpacing: 1.5 },
  title: { marginTop: space.xs },
  fieldLabel: { marginTop: space.lg, marginBottom: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
  rowChips: { flexDirection: 'row', gap: space.sm },
  flexChip: { flex: 1 },
  rateNote: { marginTop: space.sm },
  result: { marginTop: space.xl, gap: space.sm },
  smallRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: C.borderNeutral, marginVertical: space.sm },
  projected: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 34, lineHeight: 42, marginTop: 2 },
  barTrack: { height: 12, borderRadius: radius.sm, overflow: 'hidden', marginTop: space.md, backgroundColor: C.surface4 },
  barGrowth: { position: 'absolute', right: 0, top: 0, bottom: 0, backgroundColor: C.green },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
  goalBox: {
    marginTop: space.xl,
    backgroundColor: C.surface2,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: C.borderBrand,
    padding: space.lg,
    gap: space.md,
  },
  goalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalEyebrow: { letterSpacing: 1.2 },
  verdict: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  verdictText: { flex: 1 },
  note: { marginTop: space.lg },
});
