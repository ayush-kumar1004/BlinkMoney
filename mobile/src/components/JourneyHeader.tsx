import { Pressable, View, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Icon } from './Icon';
import { color as C, space } from '@/theme/tokens';

interface JourneyHeaderProps {
  step?: number; // 1-based
  total?: number;
  /** Fallback destination when there is no navigation history (deep link / reload / entry). */
  parent?: Href;
  /** Entry screen: hide the back control entirely. */
  root?: boolean;
  /** Explicit override for the back action. */
  onBack?: () => void;
}

/** Journey/setup header: back chevron + step dots. Back is always safe — it uses history when
 *  available and otherwise routes to the screen's declared parent, so GO_BACK never goes unhandled. */
export function JourneyHeader({ step, total, parent, root, onBack }: JourneyHeaderProps) {
  const router = useRouter();

  const back = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) return router.back();
    router.replace(parent ?? ('/build/intro' as Href));
  };

  return (
    <View style={styles.row}>
      {root ? (
        <View style={styles.spacer} />
      ) : (
        <Pressable onPress={back} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back">
          <Icon name="chevron-left" size={26} color={C.textPrimary} />
        </Pressable>
      )}

      {step && total ? (
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <View key={i} style={[styles.dot, i === step - 1 ? styles.dotActive : styles.dotIdle]} />
          ))}
        </View>
      ) : (
        <View />
      )}

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  dots: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 20, backgroundColor: C.green },
  dotIdle: { width: 6, backgroundColor: C.surface4 },
  spacer: { width: 26 },
});
