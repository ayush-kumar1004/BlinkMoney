import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { color as C, layout, radius } from '@/theme/tokens';

interface CardProps {
  children: ReactNode;
  brand?: boolean; // brand border (dark green) vs neutral hairline
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, brand, style }: CardProps) {
  return (
    <View style={[styles.card, brand ? styles.brand : styles.neutral, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface1,
    borderRadius: radius.card,
    padding: layout.cardPad,
    borderWidth: 1,
  },
  neutral: { borderColor: C.borderNeutral },
  brand: { borderColor: C.borderBrand },
});
