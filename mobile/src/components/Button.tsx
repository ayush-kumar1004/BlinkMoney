import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { color as C, radius, space } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: IconName;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', disabled, icon, style }: ButtonProps) {
  const textColor =
    variant === 'primary' ? C.greenOnFill : disabled ? C.textTertiary : C.green;

  const handle = () => {
    if (disabled) return;
    Haptics.selectionAsync().catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPress={handle}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && (variant === 'primary' ? styles.primaryDisabled : styles.disabled),
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <View style={styles.row}>
        <Text variant="label" color={textColor} style={styles.label}>
          {label}
        </Text>
        {icon ? <Icon name={icon} size={18} color={textColor} strokeWidth={2.2} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.btn,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  label: { fontSize: 16 },
  primary: { backgroundColor: C.green },
  secondary: { backgroundColor: C.greenGlass, borderWidth: 1, borderColor: C.borderBrand },
  ghost: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
  primaryDisabled: { backgroundColor: C.surface3 },
});
