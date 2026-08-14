import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { JourneyHeader } from '@/components/JourneyHeader';
import { ProgressMeter } from '@/components/ProgressMeter';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { InfoNote } from '@/components/InfoNote';
import { useGoalMetrics } from '@/store/selectors';
import { formatMonthYear, formatINR } from '@/lib/calc';
import { color as C, radius, space } from '@/theme/tokens';

export default function Insights() {
  const router = useRouter();
  const m = useGoalMetrics();

  if (!m) {
    return (
      <Screen footer={<Button label="Start building" icon="arrow-right" onPress={() => router.replace('/build/intro')} />}>
        <JourneyHeader parent="/build/goal" />
        <View style={styles.emptyWrap}>
          <Icon name="trending-up" size={40} color={C.textTertiary} />
          <Text variant="sub" center style={styles.emptyTitle}>
            No insights yet
          </Text>
          <Text variant="body" color={C.textSecondary} center style={styles.emptySub}>
            Set a goal and add your first contribution — your pace and projections will appear here.
          </Text>
        </View>
      </Screen>
    );
  }

  // All derived values come from the single central selector.
  const {
    goal,
    progress: pct,
    remaining,
    daysToGoal: days,
    completionDate: completion,
    onTrack,
    dailyPace: perDay,
    monthlyPace,
    addedThisSession,
  } = m;

  return (
    <Screen scroll>
      <JourneyHeader parent="/build/goal" />
      <Text variant="micro" color={C.textSecondary} style={styles.eyebrow}>
        {goal.name.toUpperCase()} · INSIGHTS
      </Text>
      <Text variant="hero">
        At this pace,{'\n'}you&apos;ll finish{' '}
        <Text variant="hero" color={C.green}>
          {formatMonthYear(completion)}
        </Text>
      </Text>

      <View style={[styles.statusChip, onTrack ? styles.onTrack : styles.behind]}>
        <Icon name={onTrack ? 'trending-up' : 'info'} size={16} color={onTrack ? C.green : C.error} />
        <Text variant="label" color={onTrack ? C.green : C.error}>
          {onTrack ? 'On pace for your timeline' : 'Behind your target date'}
        </Text>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressRow}>
          <AnimatedNumber value={Math.round(pct * 100)} variant="label" color={C.textSecondary} duration={800} format={(n) => `${Math.round(n)}% built`} />
          <AnimatedNumber value={remaining} variant="label" color={C.textSecondary} duration={800} format={(n) => `${formatINR(n)} to go`} />
        </View>
        <ProgressMeter value={pct} height={6} />
      </View>

      <View style={styles.grid}>
        <Stat label="Daily pace" value={perDay} format={formatINR} />
        <Stat label="Monthly pace" value={monthlyPace} format={formatINR} />
        <Stat label="Days to goal" value={Number.isFinite(days) ? days : 0} format={(n) => (Number.isFinite(days) ? `${Math.round(n)}` : '—')} />
        <Stat label="Added this session" value={addedThisSession} format={formatINR} />
      </View>

      <Card style={styles.growCard}>
        <View style={styles.growRow}>
          <View style={styles.growText}>
            <Text variant="titleLg">The magic of compounding</Text>
            <Text variant="caption" color={C.textSecondary}>
              See how your money grows on its own.
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={C.textSecondary} />
        </View>
        <Button label="See how it grows" variant="secondary" onPress={() => router.push('/build/compounding')} style={styles.growBtn} />
      </Card>

      <View style={styles.note}>
        <InfoNote>
          Projected at your current daily pace. Estimates only — actual returns vary, are not
          guaranteed, and market conditions apply.
        </InfoNote>
      </View>
    </Screen>
  );
}

function Stat({ label, value, format }: { label: string; value: number; format: (n: number) => string }) {
  return (
    <Card style={styles.stat}>
      <Text variant="caption" color={C.textSecondary}>
        {label}
      </Text>
      <AnimatedNumber value={value} variant="titleLg" color={C.textPrimary} duration={800} format={format} />
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: space.xl },
  emptySub: { marginTop: space.md, maxWidth: 300 },
  eyebrow: { letterSpacing: 1.2, marginTop: space.sm, marginBottom: space.sm },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    marginTop: space.lg,
  },
  onTrack: { backgroundColor: C.greenGlass, borderColor: C.borderBrand },
  behind: { backgroundColor: 'rgba(255,88,84,0.1)', borderColor: 'rgba(255,88,84,0.3)' },
  progressWrap: { marginTop: space.xl, gap: space.sm },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.xl },
  stat: { width: '47%', flexGrow: 1, gap: space.xs },
  growCard: { marginTop: space.xl, gap: space.lg },
  growRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  growText: { gap: 2, flex: 1 },
  growBtn: { marginTop: space.xs },
  note: { marginTop: space.xl },
});
