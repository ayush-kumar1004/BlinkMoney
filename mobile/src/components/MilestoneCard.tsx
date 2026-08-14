import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Text } from './Text';
import { Icon } from './Icon';
import { color as C, space } from '@/theme/tokens';

interface MilestoneCardProps {
  label: string;
  pct: number; // threshold 0..1
  style?: any;
}

/** Next milestone = a meaningful progress threshold, not a part's price. */
export function MilestoneCard({ label, pct, style }: MilestoneCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.iconWrap}>
        <Icon name="lock" size={18} color={C.textSecondary} />
      </View>
      <Text variant="titleLg">{label}</Text>
      <Text variant="caption" color={C.textSecondary}>
        unlocks at {Math.round(pct * 100)}%
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
