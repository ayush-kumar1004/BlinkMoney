import { Pressable, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { Icon } from './Icon';
import { color as C, radius, space } from '@/theme/tokens';

interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
}

/** Fully custom numeric control — no fixed presets. */
export function Stepper({ value, onChange, min = 0, max = 999999, step = 1, format = String }: StepperProps) {
  const set = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    if (clamped !== value) {
      Haptics.selectionAsync().catch(() => {});
      onChange(clamped);
    }
  };

  return (
    <View style={styles.row}>
      <Btn icon disabled={value <= min} onPress={() => set(value - step)} name="minus" />
      <Text variant="titleLg" style={styles.value}>
        {format(value)}
      </Text>
      <Btn icon disabled={value >= max} onPress={() => set(value + step)} name="plus" />
    </View>
  );
}

function Btn({ onPress, disabled, name }: { onPress: () => void; disabled?: boolean; name: 'plus' | 'minus'; icon?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={name === 'plus' ? 'Increase' : 'Decrease'}
      style={({ pressed }) => [styles.btn, disabled && styles.btnDisabled, pressed && !disabled && { opacity: 0.7 }]}>
      {name === 'plus' ? (
        <Icon name="plus" size={20} color={disabled ? C.textTertiary : C.green} strokeWidth={2.4} />
      ) : (
        <Text variant="titleLg" color={disabled ? C.textTertiary : C.green} style={styles.minus}>
          −
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface2,
    borderRadius: radius.btn,
    borderWidth: 1,
    borderColor: C.borderNeutral,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  value: { flex: 1, textAlign: 'center' },
  btn: {
    width: 44,
    height: 44,
    borderRadius: radius.btn,
    backgroundColor: C.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  minus: { fontSize: 24, lineHeight: 26 },
});
