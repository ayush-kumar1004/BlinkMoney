import { Pressable, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { color as C, radius, space } from '@/theme/tokens';

interface GoalCategoryCardProps {
  label: string;
  icon: IconName | 'plus';
  selected?: boolean;
  onPress?: () => void;
}

export function GoalCategoryCard({ label, icon, selected, onPress }: GoalCategoryCardProps) {
  const tint = selected ? C.green : C.textNear;
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
        styles.card,
        selected ? styles.selected : styles.idle,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}>
      <View style={[styles.iconWrap, selected && { backgroundColor: C.greenGlass }]}>
        <Icon name={icon === 'plus' ? 'plus' : icon} size={26} color={selected ? C.green : C.textNear} strokeWidth={1.6} />
      </View>
      <Text variant="label" color={tint}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1.15,
    backgroundColor: C.surface1,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
  },
  idle: { borderColor: C.borderNeutral },
  selected: { borderColor: C.green, backgroundColor: C.surface2 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: C.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
