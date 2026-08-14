import { useEffect } from 'react';
import { StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { color as C, radius } from '@/theme/tokens';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  br?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, br = radius.sm, style }: SkeletonProps) {
  const o = useSharedValue(0.4);
  useEffect(() => {
    o.value = withRepeat(withTiming(0.9, { duration: 800 }), -1, true);
  }, [o]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.base, { width, height, borderRadius: br }, anim, style]} />;
}

const styles = StyleSheet.create({
  base: { backgroundColor: C.surface3 },
});
