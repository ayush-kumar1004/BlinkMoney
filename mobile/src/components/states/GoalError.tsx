import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { color as C, radius, space } from '@/theme/tokens';

/** Error state — calm, never blames the user; red used only on the icon. */
export function GoalError({ onRetry }: { onRetry: () => void }) {
  return (
    <Screen>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Icon name="info" size={28} color={C.error} />
        </View>
        <Text variant="sub" center style={styles.title}>
          We couldn&apos;t load this
        </Text>
        <Text variant="body" color={C.textSecondary} center style={styles.sub}>
          Please check your connection and try again.
        </Text>
        <Button label="Try again" variant="secondary" icon="arrow-right" onPress={onRetry} style={styles.btn} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.card,
    backgroundColor: C.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: space.xl },
  sub: { marginTop: space.md, maxWidth: 280 },
  btn: { marginTop: space.xl, minWidth: 180 },
});
