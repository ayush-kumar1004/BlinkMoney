import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Text } from './Text';
import { Icon } from './Icon';
import { formatINR } from '@/lib/calc';
import { color as C, space } from '@/theme/tokens';

interface CompoundBreakdownProps {
  contributed: number;
  grew: number;
}

/** Shows that growth is separate from contribution: contributed base + green growth cap. */
export function CompoundBreakdown({ contributed, grew }: CompoundBreakdownProps) {
  const total = contributed + grew;
  const growFrac = total > 0 ? grew / total : 0;

  return (
    <Card brand style={styles.card}>
      <Row label="You contributed" value={formatINR(contributed)} />
      <View style={styles.divider} />
      <Row label="Your money grew" value={`+${formatINR(grew)}`} valueColor={C.green} icon />
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text variant="titleLg">TOTAL VALUE</Text>
        <Text variant="sub">{formatINR(total)}</Text>
      </View>
      {/* Stacked bar: neutral contribution base + green growth cap */}
      <View style={styles.bar}>
        <View style={styles.barBase} />
        <View style={[styles.barGrow, { width: `${Math.max(growFrac * 100, 4)}%` }]} />
      </View>
    </Card>
  );
}

function Row({
  label,
  value,
  valueColor = C.textPrimary,
  icon,
}: {
  label: string;
  value: string;
  valueColor?: string;
  icon?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text variant="body" color={C.textSecondary}>
        {label}
      </Text>
      <View style={styles.valueWrap}>
        {icon ? <Icon name="trending-up" size={16} color={C.green} /> : null}
        <Text variant="titleLg" color={valueColor}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md, padding: space.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valueWrap: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  divider: { height: 1, backgroundColor: C.borderNeutral },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.xs,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: C.surface3,
    overflow: 'hidden',
    marginTop: space.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  barBase: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.surface4 },
  barGrow: { height: '100%', backgroundColor: C.green, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
});
