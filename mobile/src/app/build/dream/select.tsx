import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { JourneyHeader } from '@/components/JourneyHeader';
import { GoalCategoryCard } from '@/components/GoalCategoryCard';
import { IconName } from '@/components/Icon';
import { useGoalStore, GoalType } from '@/store/goal';
import { color as C, space } from '@/theme/tokens';

const CATS: { type: GoalType; label: string; icon: IconName | 'plus' }[] = [
  { type: 'bike', label: 'Bike', icon: 'bike' },
  { type: 'car', label: 'Car', icon: 'car' },
  { type: 'trip', label: 'Trip', icon: 'trip' },
  { type: 'home', label: 'Home', icon: 'house' },
  { type: 'business', label: 'Business', icon: 'briefcase' },
  { type: 'custom', label: 'Custom', icon: 'plus' },
];

export default function DreamSelect() {
  const router = useRouter();
  const selected = useGoalStore((s) => s.draft.type);
  const selectGoalType = useGoalStore((s) => s.selectGoalType);

  const choose = (t: GoalType) => {
    selectGoalType(t);
    // Custom has no preset models — go straight to configuring the amount.
    router.push(t === 'custom' ? '/build/dream/config' : '/build/dream/model');
  };

  return (
    <Screen scroll>
      <JourneyHeader step={1} total={3} parent="/build/intro" />
      <View style={styles.header}>
        <Text variant="hero">Choose your dream</Text>
        <Text variant="body" color={C.textSecondary} style={styles.sub}>
          What are you saving for?
        </Text>
      </View>

      <View style={styles.grid}>
        {CATS.map((c, i) => (
          <Animated.View
            key={c.type}
            entering={FadeInDown.delay(80 + i * 60).duration(360)}
            style={styles.cell}>
            <GoalCategoryCard
              label={c.label}
              icon={c.icon}
              selected={selected === c.type}
              onPress={() => choose(c.type)}
            />
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.xl, marginBottom: space.xxl },
  sub: { marginTop: space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.lg },
  cell: { width: '47%', flexGrow: 1 },
});
