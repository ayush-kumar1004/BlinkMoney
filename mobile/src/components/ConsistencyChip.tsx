import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Text } from './Text';
import { Icon } from './Icon';
import { color as C, space } from '@/theme/tokens';

/** Calm consistency indicator — "N days of showing up". No streak/reset/countdown language. */
export function ConsistencyChip({ days, style }: { days: number; style?: any }) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.iconWrap}>
        <Icon name="flame" size={20} color={C.green} />
      </View>
      <Text variant="titleLg">{days} days</Text>
      <Text variant="caption" color={C.textSecondary}>
        of showing up
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: 2 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.surface3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
});
