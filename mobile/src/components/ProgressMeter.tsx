import { View, StyleSheet } from 'react-native';
import { color as C } from '@/theme/tokens';

interface ProgressMeterProps {
  value: number; // 0..1 actual
  projected?: number; // 0..1 (>= value), illustrative
  height?: number;
  rounded?: boolean;
}

/** Two-truth meter: solid green actual + dim-green projected extension. */
export function ProgressMeter({ value, projected, height = 6, rounded = true }: ProgressMeterProps) {
  const v = Math.min(Math.max(value, 0), 1);
  const p = projected ? Math.min(Math.max(projected, v), 1) : 0;
  const br = rounded ? height / 2 : 0;

  return (
    <View style={[styles.track, { height, borderRadius: br }]}>
      {p > 0 ? (
        <View
          style={[styles.projected, { width: `${p * 100}%`, borderRadius: br }]}
        />
      ) : null}
      <View style={[styles.actual, { width: `${v * 100}%`, borderRadius: br }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: C.surface3, overflow: 'hidden', width: '100%' },
  projected: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: C.greenProjected },
  actual: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: C.green },
});
