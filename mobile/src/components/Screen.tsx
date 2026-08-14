import { ReactNode } from 'react';
import { ScrollView, View, ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { color as C, layout, space } from '@/theme/tokens';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  gutter?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  /** Sticky footer rendered outside the scroll area (e.g. a primary CTA). */
  footer?: ReactNode;
}

export function Screen({
  children,
  scroll = false,
  gutter = true,
  edges = ['top', 'bottom'],
  contentStyle,
  footer,
}: ScreenProps) {
  const pad: ViewStyle = { paddingHorizontal: gutter ? layout.gutter : 0 };
  const cap: ViewStyle = { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' };

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, pad, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={cap}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.flex, pad]}>
          <View style={[styles.flex, cap, contentStyle]}>{children}</View>
        </View>
      )}
      {footer ? <View style={[pad, styles.footer]}>{<View style={cap}>{footer}</View>}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: space.xl },
  footer: { paddingTop: space.md, paddingBottom: space.sm },
});
