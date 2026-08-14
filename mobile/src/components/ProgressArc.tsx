import { ReactNode, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { color as C, motion } from '@/theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** A circular progress arc with content centered inside (e.g. the goal illustration). */
export function ProgressArc({
  progress,
  size = 260,
  children,
}: {
  progress: number;
  size?: number;
  children?: ReactNode;
}) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const frac = Math.min(Math.max(progress, 0), 1);

  const sweep = useSharedValue(0);
  useEffect(() => {
    sweep.value = withTiming(frac, { duration: 900, easing: Easing.bezier(...motion.easing) });
  }, [frac, sweep]);

  const arcProps = useAnimatedProps(() => ({ strokeDashoffset: circ * (1 - sweep.value) }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={styles.rotate}>
        <Circle cx={c} cy={c} r={r} stroke={C.surface2} strokeWidth={stroke} fill="none" strokeDasharray="2,10" />
        <AnimatedCircle
          cx={c}
          cy={c}
          r={r}
          stroke={C.green}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circ}, ${circ}`}
          animatedProps={arcProps}
        />
      </Svg>
      <View style={[styles.center, { pointerEvents: 'box-none' }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotate: { transform: [{ rotate: '-90deg' }] },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
