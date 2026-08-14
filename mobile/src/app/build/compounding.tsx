import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { Stepper } from '@/components/Stepper';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { JourneyHeader } from '@/components/JourneyHeader';
import { InfoNote } from '@/components/InfoNote';
import { useGoalStore } from '@/store/goal';
import { assumedGrowthPa, compoundingHorizons } from '@/mocks';
import { investedTotal, futureValueSIP, formatINR } from '@/lib/calc';
import { color as C, radius, space } from '@/theme/tokens';

export default function Compounding() {
  const router = useRouter();
  const goal = useGoalStore((s) => s.activeGoal);
  const freedom = useGoalStore((s) => s.freedom);

  const [daily, setDaily] = useState(goal?.dailyContribution ?? freedom.dailyContribution ?? 100);
  const [years, setYears] = useState(10);

  const invested = investedTotal(daily, years);
  const fv = futureValueSIP(daily, years, assumedGrowthPa);
  const growth = Math.max(fv - invested, 0);
  const growthShare = fv > 0 ? growth / fv : 0;

  // Animate the growth portion of the bar when the inputs change.
  const growthW = useSharedValue(growthShare);
  useEffect(() => {
    growthW.value = withTiming(growthShare, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [growthShare, growthW]);
  const growthBarStyle = useAnimatedStyle(() => ({ width: `${growthW.value * 100}%` }));

  return (
    <Screen scroll footer={<Button label="Got it" icon="arrow-right" onPress={() => (router.canGoBack() ? router.back() : router.replace('/build/goal'))} />}>
      <JourneyHeader parent="/build/goal" />
      <Text variant="micro" color={C.textSecondary} style={styles.eyebrow}>
        HOW COMPOUNDING WORKS
      </Text>
      <Text variant="hero">
        Your money can{'\n'}work for{' '}
        <Text variant="hero" color={C.green}>
          you.
        </Text>
      </Text>
      <Text variant="body" color={C.textSecondary} style={styles.intro}>
        When you invest, your money earns a return. Then that return earns its own return — again and
        again. The longer you stay, the more your money grows on its own, without you adding a rupee.
      </Text>

      {/* Controls — try YOUR numbers */}
      <Text variant="label" color={C.textSecondary} style={styles.ctrlLabel}>
        If you invest
      </Text>
      <Stepper value={daily} onChange={setDaily} min={10} max={5000} step={10} format={(v) => `₹${v} / day`} />

      <Text variant="label" color={C.textSecondary} style={styles.ctrlLabel}>
        for
      </Text>
      <View style={styles.chips}>
        {compoundingHorizons.map((y) => (
          <Chip key={y} label={`${y} yr`} selected={years === y} onPress={() => setYears(y)} style={styles.chip} />
        ))}
      </View>

      {/* Personalized result */}
      <Card style={styles.result}>
        <Row label="You put in" value={invested} />
        <Row label="Your money adds" value={growth} prefix="+" valueColor={C.green} />
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text variant="label" color={C.textSecondary}>
            You could have
          </Text>
          <AnimatedNumber value={fv} variant="sub" color={C.green} duration={700} format={(n) => formatINR(n)} />
        </View>

        {/* Principal (neutral track) vs Growth (green, animated width from the right) */}
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barGrowth, growthBarStyle]} />
        </View>
        <View style={styles.legend}>
          <Text variant="caption" color={C.textSecondary}>
            You added {Math.round((1 - growthShare) * 100)}%
          </Text>
          <Text variant="caption" color={C.green}>
            Growth {Math.round(growthShare * 100)}%
          </Text>
        </View>
      </Card>

      <Text variant="body" color={C.textNear} style={styles.punch}>
        That&apos;s{' '}
        <Text variant="body" color={C.green}>
          {formatINR(growth)}
        </Text>{' '}
        you never had to earn — your money made it for you.
      </Text>

      <View style={styles.note}>
        <InfoNote>
          Assumes an illustrative {(assumedGrowthPa * 100).toFixed(0)}% p.a. return — not guaranteed.
          Investments are subject to market risk.
        </InfoNote>
      </View>
    </Screen>
  );
}

function Row({ label, value, prefix = '', valueColor }: { label: string; value: number; prefix?: string; valueColor?: string }) {
  return (
    <View style={styles.row}>
      <Text variant="body" color={C.textSecondary}>
        {label}
      </Text>
      <AnimatedNumber value={value} variant="titleLg" color={valueColor ?? C.textPrimary} duration={700} format={(n) => `${prefix}${formatINR(n)}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { letterSpacing: 1.5, marginTop: space.md, marginBottom: space.sm },
  intro: { marginTop: space.md },
  ctrlLabel: { marginTop: space.xl, marginBottom: space.sm },
  chips: { flexDirection: 'row', gap: space.sm },
  chip: { flex: 1 },
  result: { marginTop: space.xl, gap: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: C.borderNeutral },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barTrack: { height: 14, borderRadius: radius.sm, overflow: 'hidden', marginTop: space.sm, backgroundColor: C.surface4 },
  barGrowth: { position: 'absolute', right: 0, top: 0, bottom: 0, backgroundColor: C.green },
  legend: { flexDirection: 'row', justifyContent: 'space-between' },
  punch: { marginTop: space.xl },
  note: { marginTop: space.lg },
});
