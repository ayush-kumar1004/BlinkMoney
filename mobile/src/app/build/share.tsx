import { useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Icon, IconName } from '@/components/Icon';
import { JourneyHeader } from '@/components/JourneyHeader';
import { ShareCard } from '@/components/ShareCard';
import { useGoalStore } from '@/store/goal';
import { progressPct, progressPercentLabel } from '@/lib/calc';
import { color as C, radius, space } from '@/theme/tokens';

export default function Share() {
  const goal = useGoalStore((s) => s.activeGoal);
  const consistencyDays = useGoalStore((s) => s.consistencyDays);
  const [confirm, setConfirm] = useState<string | null>(null);

  const pct = goal ? progressPct(goal.currentSaved, goal.target) : 0;
  const pctLabel = goal ? progressPercentLabel(goal.currentSaved, goal.target) : 0;

  // Mock share/save actions for the MVP slice (no external SDK wired).
  const act = (verb: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setConfirm(verb);
  };

  return (
    <Screen scroll>
      <JourneyHeader parent="/build/goal" />

      <ShareCard percentBuilt={pctLabel} consistencyDays={consistencyDays} progress={pct} goal={goal?.type} />

      <View style={styles.row}>
        <ShareTarget label="WhatsApp" icon="share" onPress={() => act('Shared to WhatsApp')} />
        <ShareTarget label="Instagram" icon="rewards" onPress={() => act('Shared to Instagram')} />
      </View>
      <Button label="Save to gallery" icon="download" onPress={() => act('Saved to gallery')} style={styles.save} />

      {confirm ? (
        <Animated.View entering={FadeIn.duration(280)} style={styles.confirm}>
          <Icon name="trending-up" size={16} color={C.green} />
          <Text variant="label" color={C.green}>
            {confirm}
          </Text>
        </Animated.View>
      ) : null}
    </Screen>
  );
}

function ShareTarget({ label, icon, onPress }: { label: string; icon: IconName; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.target, pressed && { transform: [{ scale: 0.98 }] }]}>
      <Icon name={icon} size={22} color={C.green} />
      <Text variant="label">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.lg, marginTop: space.xl },
  target: {
    flex: 1,
    backgroundColor: C.surface2,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: C.borderNeutral,
    paddingVertical: space.xl,
    alignItems: 'center',
    gap: space.sm,
  },
  save: { marginTop: space.lg },
  confirm: { flexDirection: 'row', gap: space.sm, alignItems: 'center', justifyContent: 'center', marginTop: space.lg },
});
