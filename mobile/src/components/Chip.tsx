import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { color as C, radius, space } from '@/theme/tokens';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, selected, onPress, style }: ChipProps) {
  const handle = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress?.();
  };
  return (
    <Pressable
      onPress={handle}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}>
      <Text variant="label" color={selected ? C.green : C.textNear}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: space.md,
    paddingHorizontal: space.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselected: { backgroundColor: C.surface2, borderColor: C.borderNeutral },
  selected: { backgroundColor: C.greenGlass, borderColor: C.green },
});
