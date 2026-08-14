import { useEffect, useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { JourneyHeader } from '@/components/JourneyHeader';
import { GoalIllustration } from '@/components/GoalIllustration';
import { ProgressArc } from '@/components/ProgressArc';
import { ProgressMeter } from '@/components/ProgressMeter';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { ConsistencyChip } from '@/components/ConsistencyChip';
import { MilestoneCard } from '@/components/MilestoneCard';
import { TabBar } from '@/components/TabBar';
import { GoalEmpty } from '@/components/states/GoalEmpty';
import { GoalLoading } from '@/components/states/GoalLoading';
import { useGoalStore } from '@/store/goal';
import { useGoalMetrics } from '@/store/selectors';
import { formatINR } from '@/lib/calc';
import { color as C, radius, space } from '@/theme/tokens';

export default function Goal() {
  const router = useRouter();
  const goal = useGoalStore((s) => s.activeGoal);
  const consistencyDays = useGoalStore((s) => s.consistencyDays);
  const milestones = useGoalStore((s) => s.milestones);
  const metrics = useGoalMetrics();

  // Brief simulated fetch so the loading state is real and visible on entry.
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <GoalLoading />;
  if (!goal || !metrics) return <GoalEmpty onStart={() => router.replace('/build/intro')} />;

  const { progress: pct, pctLabel, overnightEarnings } = metrics;
  const nextMilestone = milestones.find((m) => !m.unlocked);

  return (
    <Screen scroll>
      <JourneyHeader parent="/build/intro" />

      <Pressable
        onPress={() => router.push('/build/today' as Href)}
        accessibilityRole="button"
        style={({ pressed }) => [styles.daily, pressed && { opacity: 0.85 }]}>
        <Icon name="trending-up" size={20} color={C.green} />
        <View style={styles.dailyText}>
          <Text variant="label">
            Your money grew +{formatINR(overnightEarnings)} overnight
          </Text>
          <Text variant="caption" color={C.textSecondary}>
            Tap for today&apos;s moment
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={C.textSecondary} />
      </Pressable>

      <Text variant="micro" color={C.textSecondary} style={styles.eyebrow}>
        {goal.name.toUpperCase()}
      </Text>
      <Text variant="hero">Your dream is</Text>
      <AnimatedNumber
        value={pctLabel}
        variant="hero"
        color={C.green}
        duration={1100}
        format={(n) => `${Math.round(n)}% built.`}
      />

      <View style={styles.arcWrap}>
        <ProgressArc progress={pct} size={280}>
          <GoalIllustration goal={goal.type} progress={pct} size={200} />
        </ProgressArc>
      </View>

      <View style={styles.amounts}>
        <View>
          <Text variant="label" color={C.textSecondary}>
            Current savings
          </Text>
          <AnimatedNumber value={goal.currentSaved} variant="titleLg" format={(n) => formatINR(n)} />
        </View>
        <View style={styles.alignEnd}>
          <Text variant="label" color={C.textSecondary}>
            Target
          </Text>
          <Text variant="titleLg" color={C.textSecondary}>
            {formatINR(goal.target)}
          </Text>
        </View>
      </View>
      <View style={styles.meter}>
        <ProgressMeter value={pct} height={6} />
      </View>

      <View style={styles.cards}>
        <ConsistencyChip days={consistencyDays} />
        {nextMilestone ? (
          <MilestoneCard label={nextMilestone.label} pct={nextMilestone.pct} />
        ) : null}
      </View>

      <Button
        label="Add money"
        icon="plus"
        onPress={() => router.push('/build/add')}
        style={styles.cta}
      />
      <View style={styles.secondary}>
        <Button label="Insights" variant="ghost" icon="trending-up" onPress={() => router.push('/build/insights')} />
        <Button label="Share progress" variant="ghost" icon="share" onPress={() => router.push('/build/share')} />
      </View>

      <TabBar active="save" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  daily: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: C.greenGlass,
    borderWidth: 1,
    borderColor: C.borderBrand,
    borderRadius: radius.card,
    padding: space.lg,
    marginBottom: space.lg,
  },
  dailyText: { flex: 1, gap: 2 },
  eyebrow: { letterSpacing: 1.5, marginTop: space.sm },
  arcWrap: { alignItems: 'center', marginVertical: space.xl },
  amounts: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  alignEnd: { alignItems: 'flex-end' },
  meter: { marginTop: space.md },
  cards: { flexDirection: 'row', gap: space.lg, marginTop: space.xl },
  cta: { marginTop: space.xl },
  secondary: { flexDirection: 'row', justifyContent: 'center', gap: space.lg, marginTop: space.sm },
});
