import { useEffect, useId } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Defs, ClipPath } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { color as C, motion } from '@/theme/tokens';
import type { GoalType } from '@/store/goal';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Solid silhouettes (100x100). Green "liquid" rises from the base, clipped to the exact
// shape — the goal visibly builds as progress grows. A bright waterline marks the surface.
const c = (cx: number, cy: number, r: number) =>
  ` M ${cx - r},${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-r * 2},0`;

const SILHOUETTE: Record<GoalType, string> = {
  bike: 'M22 62 L36 44 L54 44 L60 52 L80 52 L84 62 Z' + c(28, 64, 11) + c(82, 64, 11),
  car: 'M8 64 L18 50 L34 50 L44 38 L70 38 L82 50 L94 50 L94 64 Z' + c(30, 64, 9) + c(78, 64, 9),
  home: 'M50 12 L92 48 L84 48 L84 88 L16 88 L16 48 L8 48 Z',
  trip: 'M54 8 L60 12 L58 44 L94 64 L94 72 L58 60 L56 82 L68 90 L66 94 L50 88 L34 94 L32 90 L44 82 L42 60 L6 72 L6 64 L42 44 L40 12 L46 8 Z',
  business:
    'M26 34 L26 26 Q26 22 30 22 L70 22 Q74 22 74 26 L74 34 L88 34 Q92 34 92 38 L92 82 Q92 86 88 86 L12 86 Q8 86 8 82 L8 38 Q8 34 12 34 Z',
  custom: 'M50 8 L61 38 L94 38 L67 58 L77 90 L50 70 L23 90 L33 58 L6 38 L39 38 Z',
};

interface GoalIllustrationProps {
  goal?: GoalType;
  progress: number; // 0..1
  size?: number;
  animate?: boolean;
  glow?: boolean;
}

export function GoalIllustration({
  goal = 'bike',
  progress,
  size = 240,
  animate = true,
  glow,
}: GoalIllustrationProps) {
  const d = SILHOUETTE[goal] ?? SILHOUETTE.bike;
  const frac = Math.min(Math.max(progress, 0), 1);
  const complete = frac >= 0.999;
  const clipId = useId();
  const reduced = useReducedMotion();

  const fill = useSharedValue(animate && !reduced ? 0 : frac);
  useEffect(() => {
    if (reduced) {
      fill.value = frac;
      return;
    }
    fill.value = withTiming(frac, { duration: motion.celebrate, easing: Easing.bezier(...motion.easing) });
  }, [frac, fill, reduced]);

  const liquidProps = useAnimatedProps(() => {
    'worklet';
    const f = Math.min(Math.max(fill.value, 0), 1);
    return { y: 100 * (1 - f), height: 100 * f };
  });

  // Bright waterline that tracks the liquid surface (hidden at empty / full).
  const waterlineProps = useAnimatedProps(() => {
    'worklet';
    const f = Math.min(Math.max(fill.value, 0), 1);
    return { y: 100 * (1 - f) - 1, opacity: f > 0.02 && f < 0.985 ? 1 : 0 };
  });

  return (
    <View style={{ width: size, height: size }}>
      {glow || complete ? (
        <View
          style={[
            styles.glow,
            { width: size * 0.72, height: size * 0.72, borderRadius: size },
            complete && styles.glowComplete,
          ]}
        />
      ) : null}
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <ClipPath id={clipId}>
            <Path d={d} />
          </ClipPath>
        </Defs>
        {/* Ghost body (visible even at 0% so the goal is always recognisable) */}
        <Path d={d} fill={C.surface2} stroke={C.textTertiary} strokeWidth={0.8} strokeLinejoin="round" />
        {/* Rising green liquid, clipped to the goal's shape */}
        <AnimatedRect x={0} width={100} fill={C.green} clipPath={`url(#${clipId})`} animatedProps={liquidProps} />
        {/* Bright waterline highlight */}
        <AnimatedRect x={0} width={100} height={1.6} fill={C.greenBright} clipPath={`url(#${clipId})`} animatedProps={waterlineProps} />
        {/* Crisp outline on top — brighter when complete */}
        <Path
          d={d}
          fill="none"
          stroke={complete ? C.greenBright : C.green}
          strokeWidth={complete ? 2 : 1.6}
          strokeLinejoin="round"
          opacity={0.95}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: { position: 'absolute', alignSelf: 'center', top: '14%', backgroundColor: C.greenGlass },
  glowComplete: { backgroundColor: 'rgba(159,232,112,0.22)' },
});
