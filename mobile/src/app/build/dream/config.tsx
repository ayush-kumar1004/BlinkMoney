import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { CurrencyInput } from '@/components/CurrencyInput';
import { Stepper } from '@/components/Stepper';
import { JourneyHeader } from '@/components/JourneyHeader';
import { GoalIllustration } from '@/components/GoalIllustration';
import { Icon } from '@/components/Icon';
import { InfoNote } from '@/components/InfoNote';
import { useGoalStore } from '@/store/goal';
import { formatINR, formatINRCompact, formatDuration, yearsToBuild } from '@/lib/calc';
import { color as C, space } from '@/theme/tokens';

const TARGET_PRESETS = [100000, 250000, 500000, 1000000];
const DAILY_PRESETS = [100, 250, 500, 1000];

export default function DreamConfig() {
  const router = useRouter();
  const draft = useGoalStore((s) => s.draft);
  const setTarget = useGoalStore((s) => s.setDraftTarget);
  const setTimeline = useGoalStore((s) => s.setDraftTimeline);
  const setContribution = useGoalStore((s) => s.setDraftContribution);
  const confirmGoal = useGoalStore((s) => s.confirmGoal);

  const valid = draft.target > 0 && draft.dailyContribution > 0;
  const daysNeeded = draft.dailyContribution > 0 ? draft.target / draft.dailyContribution : Infinity;
  const yearsNeeded = yearsToBuild(draft.target, draft.dailyContribution);
  const onTrack = yearsNeeded <= draft.timelineYears + 0.05; // small grace so borderline reads cleanly

  const start = () => {
    if (!valid) return;
    confirmGoal();
    router.replace('/build/goal');
  };

  return (
    <Screen
      scroll
      footer={<Button label="Start building this" icon="arrow-right" onPress={start} disabled={!valid} />}>
      <JourneyHeader step={3} total={3} parent="/build/dream/model" />
      <Text variant="hero" style={styles.title}>
        {draft.name}
      </Text>
      <Text variant="body" color={C.textSecondary} style={styles.sub}>
        Customize every number to fit your life.
      </Text>

      <Card style={styles.preview} brand>
        <GoalIllustration goal={draft.type} progress={1} size={190} />
      </Card>

      {/* Target amount — fully custom */}
      <Text variant="label" color={C.textSecondary} style={styles.fieldLabel}>
        Target amount
      </Text>
      <CurrencyInput value={draft.target} onChange={setTarget} helper=" " />
      <View style={styles.chips}>
        {TARGET_PRESETS.map((v) => (
          <Chip key={v} label={`₹${formatINRCompact(v)}`} selected={draft.target === v} onPress={() => setTarget(v)} />
        ))}
      </View>

      {/* Daily amount — fully custom (what YOU can afford, not a forced pace) */}
      <Text variant="label" color={C.textSecondary} style={styles.fieldLabel}>
        How much can you invest daily?
      </Text>
      <CurrencyInput value={draft.dailyContribution} onChange={setContribution} helper=" " />
      <View style={styles.chips}>
        {DAILY_PRESETS.map((v) => (
          <Chip key={v} label={`₹${v}`} selected={draft.dailyContribution === v} onPress={() => setContribution(v)} />
        ))}
      </View>

      {/* Timeline — any number of years via stepper */}
      <Text variant="label" color={C.textSecondary} style={styles.fieldLabel}>
        Target timeline
      </Text>
      <Stepper
        value={draft.timelineYears}
        onChange={setTimeline}
        min={1}
        max={20}
        step={1}
        format={(v) => `${v} ${v === 1 ? 'year' : 'years'}`}
      />

      {/* Live, honest outcome */}
      <Card style={styles.outcome}>
        <Text variant="body" color={C.textNear}>
          At {formatINR(draft.dailyContribution)}/day, you&apos;ll build {formatINR(draft.target)} in{' '}
          <Text variant="body" color={C.green}>
            {formatDuration(daysNeeded)}
          </Text>
          .
        </Text>
        <View style={[styles.verdict, onTrack ? styles.ok : styles.slow]}>
          <Icon name={onTrack ? 'trending-up' : 'info'} size={16} color={onTrack ? C.green : C.error} />
          <Text variant="label" color={onTrack ? C.green : C.error} style={styles.verdictText}>
            {onTrack
              ? `That meets your ${draft.timelineYears}-year target.`
              : `Longer than your ${draft.timelineYears}-year target — raise your daily amount to hit it sooner.`}
          </Text>
        </View>
        <InfoNote>Estimated from your inputs and an illustrative return. Market conditions apply.</InfoNote>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space.sm },
  sub: { marginTop: space.sm },
  preview: { alignItems: 'center', marginTop: space.lg, marginBottom: space.sm, paddingVertical: space.lg },
  fieldLabel: { marginTop: space.xl, marginBottom: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.md },
  outcome: { marginTop: space.xl, gap: space.md },
  verdict: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  verdictText: { flex: 1 },
  ok: {},
  slow: {},
});
