import { TextInput, View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { color as C, radius, space } from '@/theme/tokens';

interface CurrencyInputProps {
  value: number;
  onChange: (v: number) => void;
  autoFocus?: boolean;
  helper?: string;
}

/** ₹-prefixed numeric input with large numerals. Empty renders "0". */
export function CurrencyInput({ value, onChange, autoFocus, helper }: CurrencyInputProps) {
  const grouped = value > 0 ? value.toLocaleString('en-IN') : '0';

  return (
    <View>
      <View style={styles.box}>
        <Text style={styles.rupee} color={C.textSecondary}>
          ₹
        </Text>
        <View style={styles.inputWrap}>
          <Text style={styles.display} color={value > 0 ? C.textPrimary : C.textTertiary} numberOfLines={1}>
            {grouped}
          </Text>
          <TextInput
            style={styles.hiddenInput}
            value={value > 0 ? String(value) : ''}
            onChangeText={(t) => {
              const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
              onChange(Number.isNaN(n) ? 0 : n);
            }}
            keyboardType="number-pad"
            autoFocus={autoFocus}
            accessibilityLabel="Amount in rupees"
            maxLength={9}
          />
        </View>
      </View>
      <Text variant="caption" color={C.textTertiary} style={styles.helper}>
        {helper ?? (value > 0 ? '' : 'Zero rupees')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface3,
    borderRadius: radius.btn,
    borderWidth: 1,
    borderColor: C.borderNeutral,
    paddingHorizontal: space.xl,
    paddingVertical: space.xxl,
    gap: space.sm,
  },
  rupee: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 28, lineHeight: 52 },
  inputWrap: { flex: 1, justifyContent: 'center', minHeight: 52 },
  display: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 36, lineHeight: 52, textAlign: 'right', includeFontPadding: false as any },
  hiddenInput: { position: 'absolute', width: '100%', height: '100%', opacity: 0, textAlign: 'right' },
  helper: { textAlign: 'right', marginTop: space.sm, marginRight: space.xs },
});
