import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { CurrencyInput } from '@/components/CurrencyInput';
import { JourneyHeader } from '@/components/JourneyHeader';
import { InfoNote } from '@/components/InfoNote';
import { GoalIllustration } from '@/components/GoalIllustration';
import { ProgressMeter } from '@/components/ProgressMeter';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useGoalStore } from '@/store/goal';
import { addAmountPresets } from '@/mocks';
import { formatINR, progressPct } from '@/lib/calc';
import { color as C, space } from '@/theme/tokens';

/** Flexible top-up — any amount — with a premium animated success moment afterward. */
export default function AddMoney() {
  const router = useRouter();
  const goal = useGoalStore((s) => s.activeGoal);
  const milestones = useGoalStore((s) => s.milestones);
  const addContribution = useGoalStore((s) => s.addContribution);

  const [amount, setAmount] = useState(goal?.dailyContribution ?? 21);
  const [done, setDone] = useState<{ amount: number; before: number; after: number } | null>(null);
  const valid = amount > 0;

  const confirm = () => {
    if (!valid || !goal) return;
    const before = progressPct(goal.currentSaved, goal.target);
    const beforeUnlocked = milestones.filter((m) => m.unlocked).length;
    addContribution(amount);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    const next = useGoalStore.getState();
    const after = next.activeGoal ? progressPct(next.activeGoal.currentSaved, next.activeGoal.target) : before;
    const afterUnlocked = next.milestones.filter((m) => m.unlocked).length;

    if (afterUnlocked > beforeUnlocked) router.replace('/build/milestone');
    else setDone({ amount, before, after });
  };

  // ---- SUCCESS STATE ----
  if (done && goal) {
    const deltaPct = Math.max((done.after - done.before) * 100, 0);
    return (
      <Screen
        scroll
        footer={
          <View style={styles.footer}>
            <Button label="Add more" variant="secondary" onPress={() => setDone(null)} />
            <Button label="Back to my goal" icon="arrow-right" onPress={() => router.replace('/build/goal')} />
          </View>
        }>
        <JourneyHeader parent="/build/goal" onBack={() => router.replace('/build/goal')} />
        <View style={styles.successTop}>
          <Animated.View entering={FadeIn.duration(500)}>
            <GoalIllustration goal={goal.type} progress={done.after} size={180} />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(150).duration(450)} style={styles.successText}>
            <Text variant="micro" color={C.green} style={styles.eyebrow}>
              {formatINR(done.amount)} INVESTED
            </Text>
            <Text variant="hero" center>
              Your dream moved
            </Text>
            <AnimatedNumber
              value={deltaPct}
              variant="hero"
              color={C.green}
              duration={900}
              format={(n) => `+${n.toFixed(1)}%`}
              style={styles.delta}
            />
            <Text variant="body" color={C.textSecondary} center style={styles.built}>
              Another step built. Every rupee is doing its job.
            </Text>
          </Animated.View>
          <View style={styles.meterWrap}>
            <ProgressMeter value={done.after} height={6} />
            <View style={styles.meterRow}>
              <Text variant="caption" color={C.textSecondary}>
                {Math.round(done.after * 100)}% built
              </Text>
              <Text variant="caption" color={C.textSecondary}>
                {formatINR(goal.currentSaved)} / {formatINR(goal.target)}
              </Text>
            </View>
          </View>
        </View>
      </Screen>
    );
  }

  // ---- INPUT STATE ----
  return (
    <Screen
      scroll
      footer={<Button label={valid ? `Add ${formatINR(amount)}` : 'Enter an amount'} icon="plus" onPress={confirm} disabled={!valid} />}>
      <JourneyHeader parent="/build/goal" />
      <Text variant="hero" style={styles.title}>
        How much are you{'\n'}investing today?
      </Text>
      <Text variant="body" color={C.textSecondary} style={styles.sub}>
        Your daily SIP is ₹{goal?.dailyContribution ?? 21}. Had a windfall? Add any amount.
      </Text>

      <View style={styles.input}>
        <CurrencyInput value={amount} onChange={setAmount} autoFocus helper=" " />
      </View>

      <View style={styles.chips}>
        {addAmountPresets.map((v) => (
          <Chip key={v} label={formatINR(v)} selected={amount === v} onPress={() => setAmount(v)} />
        ))}
      </View>

      <View style={styles.note}>
        <InfoNote>A one-time top-up toward your goal — it doesn&apos;t change your daily SIP.</InfoNote>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space.lg },
  sub: { marginTop: space.sm },
  input: { marginTop: space.xxl },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.xl },
  note: { marginTop: space.xxl },
  footer: { gap: space.sm },
  successTop: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: space.xl },
  successText: { alignItems: 'center', marginTop: space.lg },
  eyebrow: { letterSpacing: 1.5, marginBottom: space.sm },
  delta: { marginTop: space.xs },
  built: { marginTop: space.md, maxWidth: 300 },
  meterWrap: { width: '100%', marginTop: space.xxxl, gap: space.sm },
  meterRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
