import { Pressable, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Icon, IconName } from '@/components/Icon';
import { JourneyHeader } from '@/components/JourneyHeader';
import { useGoalStore, Path } from '@/store/goal';
import { color as C, radius, space } from '@/theme/tokens';

export default function Intro() {
  const router = useRouter();
  const setPath = useGoalStore((s) => s.setPath);
  const resetBuild = useGoalStore((s) => s.resetBuild);

  const choose = (path: Path) => {
    setPath(path);
    router.push(path === 'freedom' ? '/build/freedom/setup' : '/build/dream/select');
  };

  return (
    <Screen scroll>
      <JourneyHeader root />
      <View style={styles.header}>
        <Text variant="hero">What are you{'\n'}building toward?</Text>
        <Text variant="body" color={C.textSecondary} style={styles.sub}>
          Pick a path. We&apos;ll turn your money into progress you can see.
        </Text>
      </View>

      <PathCard
        index={0}
        tag="PATH 1"
        icon="trending-up"
        title="Build my freedom"
        subtitle="Turn your wealth into days you don't have to work."
        onPress={() => choose('freedom')}
      />
      <PathCard
        index={1}
        tag="PATH 2"
        icon="bike"
        title="Build a dream"
        subtitle="Watch a real goal take shape as you invest."
        onPress={() => choose('dream')}
      />

      <Pressable onPress={resetBuild} accessibilityRole="button" style={styles.reset}>
        <Icon name="trending-up" size={12} color={C.textTertiary} />
        <Text variant="micro" color={C.textTertiary}>
          Reset demo journey
        </Text>
      </Pressable>
    </Screen>
  );
}

function PathCard({
  index,
  tag,
  icon,
  title,
  subtitle,
  onPress,
}: {
  index: number;
  tag: string;
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(120 + index * 80).duration(400)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.cardTop}>
          <View style={styles.iconWrap}>
            <Icon name={icon} size={24} color={C.green} strokeWidth={1.6} />
          </View>
          <Text variant="micro" color={C.textSecondary} style={styles.tag}>
            {tag}
          </Text>
        </View>
        <Text variant="titleLg" style={styles.title}>
          {title}
        </Text>
        <Text variant="body" color={C.textSecondary}>
          {subtitle}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.xl, marginBottom: space.xxxl },
  sub: { marginTop: space.md },
  card: {
    backgroundColor: C.surface1,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: C.borderNeutral,
    padding: space.xl,
    marginBottom: space.lg,
  },
  pressed: { borderColor: C.green, transform: [{ scale: 0.995 }] },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.lg },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: C.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: { letterSpacing: 1 },
  title: { marginBottom: space.xs },
  reset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    marginTop: space.xxl,
    opacity: 0.6,
  },
});
