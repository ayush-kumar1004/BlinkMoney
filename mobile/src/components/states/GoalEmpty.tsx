import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { GoalIllustration } from '@/components/GoalIllustration';
import { color as C, space } from '@/theme/tokens';

/** Empty state — aspirational, never "broken". Shown when no goal exists. */
export function GoalEmpty({ onStart }: { onStart: () => void }) {
  return (
    <Screen footer={<Button label="Start building" icon="arrow-right" onPress={onStart} />}>
      <View style={styles.center}>
        <GoalIllustration progress={0} size={220} animate={false} />
        <Text variant="sub" center style={styles.title}>
          Your future is{'\n'}waiting to be built.
        </Text>
        <Text variant="body" color={C.textSecondary} center style={styles.sub}>
          Set a goal and watch it take shape, one contribution at a time.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: space.xl },
  sub: { marginTop: space.md, maxWidth: 300 },
});
