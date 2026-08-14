import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { JourneyHeader } from '@/components/JourneyHeader';
import { Skeleton } from '@/components/Skeleton';
import { space, radius } from '@/theme/tokens';

/** High-fidelity skeleton of the Goal Progress screen. */
export function GoalLoading() {
  return (
    <Screen>
      <JourneyHeader />
      <View style={styles.wrap}>
        <Skeleton width={120} height={12} />
        <Skeleton width={240} height={34} style={{ marginTop: space.md }} />
        <Skeleton width={160} height={34} style={{ marginTop: space.sm }} />
        <View style={styles.circle}>
          <Skeleton width={220} height={220} br={110} />
        </View>
        <View style={styles.row}>
          <Skeleton width={120} height={20} />
          <Skeleton width={100} height={20} />
        </View>
        <Skeleton height={6} br={3} style={{ marginTop: space.md }} />
        <View style={[styles.row, { marginTop: space.xl }]}>
          <Skeleton width="47%" height={96} br={radius.card} />
          <Skeleton width="47%" height={96} br={radius.card} />
        </View>
        <Skeleton height={52} br={radius.btn} style={{ marginTop: space.xl }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  circle: { alignItems: 'center', marginVertical: space.xxl },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});
