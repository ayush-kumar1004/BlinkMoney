import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from './Text';
import { AnimatedNumber } from './AnimatedNumber';
import { color as C, motion } from '@/theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RunwayRingProps {
  days: number;
  maxDays?: number;
  projectedDays?: number; // illustrative extension
  size?: number;
}

/** Circular runway gauge: actual coverage sweeps in green; projected extension in dim green. */
export function RunwayRing({ days, maxDays = 90, projectedDays, size = 240 }: RunwayRingProps) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;

  const actualFrac = Math.min(days / maxDays, 1);
  const projFrac = projectedDays ? Math.min(projectedDays / maxDays, 1) : 0;

  const sweep = useSharedValue(0);
  const projSweep = useSharedValue(0);

  useEffect(() => {
    sweep.value = withTiming(actualFrac, { duration: 900, easing: Easing.bezier(...motion.easing) });
    projSweep.value = withTiming(projFrac, {
      duration: 900,
      easing: Easing.bezier(...motion.easing),
    });
  }, [actualFrac, projFrac, sweep, projSweep]);

  const actualProps = useAnimatedProps(() => ({ strokeDashoffset: circ * (1 - sweep.value) }));
  const projProps = useAnimatedProps(() => ({ strokeDashoffset: circ * (1 - projSweep.value) }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={styles.rotate}>
        {/* track */}
        <Circle cx={cx} cy={cx} r={r} stroke={C.surface3} strokeWidth={stroke} fill="none" />
        {/* projected (behind actual) */}
        {projectedDays ? (
          <AnimatedCircle
            cx={cx}
            cy={cx}
            r={r}
            stroke={C.greenProjected}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circ}, ${circ}`}
            animatedProps={projProps}
          />
        ) : null}
        {/* actual */}
        <AnimatedCircle
          cx={cx}
          cy={cx}
          r={r}
          stroke={C.green}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ}, ${circ}`}
          animatedProps={actualProps}
        />
      </Svg>
      <View style={[styles.center, { pointerEvents: 'none' }]}>
        <View style={styles.centerRow}>
          <AnimatedNumber value={days} variant="hero" style={styles.big} />
          <Text variant="sub" color={C.green} style={styles.daysLabel}>
            {' '}days
          </Text>
        </View>
        <Text variant="micro" color={C.textSecondary}>
          OF RUNWAY
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotate: { transform: [{ rotate: '-90deg' }] },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  centerRow: { flexDirection: 'row', alignItems: 'baseline' },
  big: { fontSize: 52, lineHeight: 58, color: C.textPrimary },
  daysLabel: { marginBottom: 4 },
});
