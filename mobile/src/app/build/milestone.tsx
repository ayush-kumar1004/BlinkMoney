import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { JourneyHeader } from '@/components/JourneyHeader';
import { GoalIllustration } from '@/components/GoalIllustration';
import { useGoalStore } from '@/store/goal';
import { progressPct, formatINR } from '@/lib/calc';
import { color as C, space } from '@/theme/tokens';

export default function Milestone() {
  const router = useRouter();
  const goal = useGoalStore((s) => s.activeGoal);
  const lastMilestone = useGoalStore((s) => s.lastMilestone);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const pct = goal ? progressPct(goal.currentSaved, goal.target) : 0;
  const label = lastMilestone?.label ?? 'Milestone reached';

  return (
    <Screen>
      <JourneyHeader parent="/build/goal" />
      <View style={styles.center}>
        <Animated.View entering={FadeIn.duration(600)}>
          <GoalIllustration goal={goal?.type} progress={pct} size={220} glow />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(300).duration(500)}>
          <Text variant="micro" color={C.green} center style={styles.eyebrow}>
            MILESTONE REACHED
          </Text>
          <Text variant="hero" center style={styles.title}>
            {label}.
          </Text>
          {goal ? (
            <Text variant="body" center style={styles.sub}>
              You&apos;ve built {Math.round(pct * 100)}% of your goal — {formatINR(goal.currentSaved)} so far.
            </Text>
          ) : null}
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <Button label="Share this milestone" icon="share" onPress={() => router.replace('/build/share')} />
        <Button label="Keep building" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/build/goal'))} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { letterSpacing: 1.5, marginTop: space.xxl },
  title: { marginTop: space.sm },
  sub: { marginTop: space.md, opacity: 0.8 },
  actions: { gap: space.sm, paddingBottom: space.lg },
});
