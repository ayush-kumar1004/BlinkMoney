import { Pressable, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { JourneyHeader } from '@/components/JourneyHeader';
import { useGoalStore } from '@/store/goal';
import { GOAL_MODELS } from '@/mocks';
import { formatINR } from '@/lib/calc';
import { color as C, radius, space } from '@/theme/tokens';

export default function DreamModel() {
  const router = useRouter();
  const type = useGoalStore((s) => s.draft.type);
  const selectedName = useGoalStore((s) => s.draft.name);
  const setModel = useGoalStore((s) => s.setModel);
  const models = GOAL_MODELS[type] ?? [];

  const choose = (name: string, price: number) => {
    setModel(name, price);
    router.push('/build/dream/config');
  };

  return (
    <Screen
      scroll
      footer={<Button label="Set a custom amount instead" variant="ghost" onPress={() => router.push('/build/dream/config')} />}>
      <JourneyHeader step={2} total={3} parent="/build/dream/select" />
      <Text variant="hero" style={styles.title}>
        Which one are you{'\n'}building toward?
      </Text>
      <Text variant="body" color={C.textSecondary} style={styles.sub}>
        Pick one to set a target — you can fine-tune it next.
      </Text>

      <View style={styles.list}>
        {models.map((m, i) => {
          const on = selectedName === m.name;
          return (
            <Animated.View key={m.name} entering={FadeInDown.delay(80 + i * 70).duration(360)}>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  choose(m.name, m.price);
                }}
                accessibilityRole="button"
                style={({ pressed }) => [styles.row, on && styles.rowOn, pressed && { transform: [{ scale: 0.99 }] }]}>
                <View style={styles.rowText}>
                  <Text variant="titleLg" color={on ? C.green : C.textPrimary}>
                    {m.name}
                  </Text>
                  <Text variant="body" color={C.textSecondary}>
                    ~{formatINR(m.price)}
                  </Text>
                </View>
                <Icon name="chevron-right" size={22} color={C.textSecondary} />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: space.lg },
  sub: { marginTop: space.sm },
  list: { marginTop: space.xl, gap: space.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface1,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: C.borderNeutral,
    padding: space.xl,
  },
  rowOn: { borderColor: C.green, backgroundColor: C.surface2 },
  rowText: { gap: 2 },
});
