import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { GoalIllustration } from './GoalIllustration';
import type { GoalType } from '@/store/goal';
import { color as C, radius, space } from '@/theme/tokens';

interface ShareCardProps {
  percentBuilt: number; // whole number
  consistencyDays: number;
  progress: number; // 0..1 for the illustration
  goal?: GoalType;
}

/** The shareable poster. No rupee amounts. Subtle branding. Built portion shows green. */
export function ShareCard({ percentBuilt, consistencyDays, progress, goal }: ShareCardProps) {
  return (
    <View style={styles.card}>
      <Text variant="hero" center>
        {percentBuilt}% built
      </Text>
      <Text variant="body" color={C.textSecondary} center style={styles.sub}>
        {consistencyDays} days of showing up
      </Text>

      <View style={styles.art}>
        <GoalIllustration goal={goal} progress={progress} size={200} animate={false} />
      </View>

      <Text variant="caption" color={C.textTertiary} center style={styles.brand}>
        BLINKMONEY
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface1,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: C.borderNeutral,
    paddingVertical: space.xxxl,
    paddingHorizontal: space.xl,
    alignItems: 'center',
  },
  sub: { marginTop: space.xs },
  art: { marginVertical: space.xl },
  brand: { letterSpacing: 4 },
});
