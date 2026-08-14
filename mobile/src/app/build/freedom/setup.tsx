import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { CurrencyInput } from '@/components/CurrencyInput';
import { JourneyHeader } from '@/components/JourneyHeader';
import { InfoNote } from '@/components/InfoNote';
import { useGoalStore } from '@/store/goal';
import { monthlyCostQuickPicks } from '@/mocks';
import { formatINRCompact } from '@/lib/calc';
import { color as C, space } from '@/theme/tokens';

export default function FreedomSetup() {
  const router = useRouter();
  const stored = useGoalStore((s) => s.freedom.monthlyCost);
  const setMonthlyCost = useGoalStore((s) => s.setMonthlyCost);
  const [cost, setCost] = useState(stored);

  const valid = cost > 0;
  const cont = () => {
    if (!valid) return;
    setMonthlyCost(cost);
    router.push('/build/freedom/result');
  };

  return (
    <Screen
      scroll
      footer={<Button label="Continue" icon="arrow-right" onPress={cont} disabled={!valid} />}>
      <JourneyHeader step={1} total={2} parent="/build/intro" />
      <View style={styles.header}>
        <Text variant="hero">What does your{'\n'}life cost each month?</Text>
        <Text variant="body" color={C.textSecondary} style={styles.sub}>
          Be honest — this is the foundation of your runway number.
        </Text>
      </View>

      <CurrencyInput value={cost} onChange={setCost} autoFocus />

      <View style={styles.chips}>
        {monthlyCostQuickPicks.map((v) => (
          <Chip
            key={v}
            label={formatINRCompact(v)}
            selected={cost === v}
            onPress={() => setCost(v)}
          />
        ))}
      </View>

      <View style={styles.note}>
        <InfoNote>
          Your existing BlinkMoney portfolio is used automatically — you don&apos;t need to enter it.
        </InfoNote>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: space.xl, marginBottom: space.xxxl },
  sub: { marginTop: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.xl },
  note: { marginTop: space.xxl },
});
