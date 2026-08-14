import { Pressable, View, StyleSheet } from 'react-native';
import { useRouter, usePathname, type Href } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { Icon, IconName } from './Icon';
import { color as C, radius, space } from '@/theme/tokens';

const TABS: { key: string; label: string; icon: IconName; href: Href }[] = [
  { key: 'home', label: 'Home', icon: 'home', href: '/build/intro' as Href },
  { key: 'save', label: 'Save', icon: 'save', href: '/build/goal' as Href },
  { key: 'borrow', label: 'Borrow', icon: 'borrow', href: '/build/goal' as Href },
  { key: 'rewards', label: 'Rewards', icon: 'rewards', href: '/build/share' as Href },
];

/** BlinkMoney bottom nav — pill container, active item highlighted. Navigational:
 *  Home → the "what are you building" hub (Freedom + Dream), Save → goal, Rewards → share. */
export function TabBar({ active }: { active?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (key: string, href: string) => (active ? key === active : pathname === href);

  return (
    <View style={styles.wrap}>
      <View style={styles.pill}>
        {TABS.map((t) => {
          const on = isActive(t.key, String(t.href));
          return (
            <Pressable
              key={t.key}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                router.replace(t.href);
              }}
              accessibilityRole="button"
              accessibilityLabel={t.label}
              style={styles.item}>
              <Icon name={t.icon} size={22} color={on ? C.green : C.textSecondary} />
              <Text variant="micro" color={on ? C.green : C.textSecondary} style={styles.label}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingTop: space.sm },
  pill: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: C.surface1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: C.borderNeutral,
    paddingVertical: space.md,
  },
  item: { alignItems: 'center', gap: 3, flex: 1 },
  label: { fontSize: 11 },
});
