import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { color as C, space } from '@/theme/tokens';

/** Compliance caption row — used for all illustrative/assumed/projected disclaimers. */
export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <View style={styles.row}>
      <Icon name="info" size={16} color={C.textTertiary} />
      <Text variant="caption" color={C.textTertiary} style={styles.text}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  text: { flex: 1 },
});
