import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Stepper } from '@/components/Stepper';
import { RunwayRing } from '@/components/RunwayRing';
import { JourneyHeader } from '@/components/JourneyHeader';
import { TabBar } from '@/components/TabBar';
import { InfoNote } from '@/components/InfoNote';
import { useGoalStore, contributionOptions } from '@/store/goal';
import { useFreedomMetrics } from '@/store/selectors';
import { formatINR } from '@/lib/calc';
import { color as C, space } from '@/theme/tokens';

export default function FreedomResult() {
  const router = useRouter();
  const freedom = useGoalStore((s) => s.freedom);
  const setContribution = useGoalStore((s) => s.setFreedomContribution);
  const completeBuildSetup = useGoalStore((s) => s.completeBuildSetup);
  const { runwayDays: days, projectedRunwayDays: projected, extraRunwayDays: extra } = useFreedomMetrics();

  // Reaching the runway result means the Freedom setup is complete → returning users skip intro.
  useEffect(() => {
    completeBuildSetup();
  }, [completeBuildSetup]);

  return (
    <Screen scroll gutter={false}>
      <View style={styles.gutter}>
        <JourneyHeader parent="/build/freedom/setup" />
        <Text variant="hero" style={styles.hero}>
          Here&apos;s your runway.
        </Text>
        <Text variant="body" color={C.textSecondary} style={styles.sub}>
          How long your portfolio covers your lifestyle, starting today.
        </Text>
      </View>

      <View style={styles.ringWrap}>
        <RunwayRing days={days} projectedDays={projected} maxDays={90} size={260} />
      </View>

      <View style={styles.gutter}>
        <Card style={styles.facts}>
          <Fact label="Portfolio wealth" value={formatINR(freedom.currentWealth)} />
          <View style={styles.factDivider} />
          <Fact label="Monthly cost" value={formatINR(freedom.monthlyCost)} />
        </Card>

        <Text variant="label" color={C.textSecondary} style={styles.pickLabel}>
          If you add a little each day
        </Text>
        <View style={styles.chips}>
          {contributionOptions.map((v) => (
            <Chip
              key={v}
              label={`₹${v}/day`}
              selected={freedom.dailyContribution === v}
              onPress={() => setContribution(v)}
              style={styles.chip}
            />
          ))}
        </View>

        <View style={styles.customRow}>
          <Text variant="caption" color={C.textSecondary} style={styles.customLabel}>
            Or set your own amount
          </Text>
          <Stepper
            value={freedom.dailyContribution}
            onChange={setContribution}
            min={10}
            max={5000}
            step={10}
            format={(v) => `₹${v}/day`}
          />
        </View>

        <Animated.View key={extra} entering={FadeIn.duration(280)}>
          <Text variant="label" color={C.greenProjected} style={styles.projLine}>
            +₹{freedom.dailyContribution}/day ≈ +{extra} days of runway this year
          </Text>
        </Animated.View>

        <View style={styles.note}>
          <InfoNote>
            Projected figure is illustrative — assumes {(freedom.assumedReturnPa * 100).toFixed(1)}% p.a., subject to market risk. Current runway is derived from your actual wealth and monthly cost.
          </InfoNote>
        </View>

        <Card style={styles.explainer}>
          <View style={styles.explainerHead}>
            <Icon name="info" size={18} color={C.green} />
            <Text variant="titleLg">What is runway?</Text>
          </View>
          <Text variant="body" color={C.textNear} style={styles.explainerBody}>
            Runway is how long your savings could cover your everyday life if your income stopped —
            like fuel in a tank.
          </Text>
          <Text variant="body" color={C.textSecondary} style={styles.explainerBody}>
            Real example: your life costs {formatINR(freedom.monthlyCost)}/month and you&apos;ve invested{' '}
            {formatINR(freedom.currentWealth)} — that&apos;s about {days} days of cover. If your pay
            stopped today, you could keep living normally for ~{days} days without borrowing or earning.
            Investing a little each day adds fuel and stretches that runway further.
          </Text>
        </Card>

        <Button label="See how investing helps" icon="arrow-right" onPress={() => router.push('/build/compounding')} style={styles.cta} />
      </View>

      <TabBar active="save" />
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.factRow}>
      <Text variant="body" color={C.textSecondary}>
        {label}
      </Text>
      <Text variant="titleLg">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gutter: { paddingHorizontal: space.xl },
  hero: { marginTop: space.lg },
  sub: { marginTop: space.sm },
  ringWrap: { alignItems: 'center', marginVertical: space.xxl },
  facts: { gap: space.md },
  factRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  factDivider: { height: 1, backgroundColor: C.borderNeutral },
  pickLabel: { marginTop: space.xxl, marginBottom: space.md },
  chips: { flexDirection: 'row', gap: space.md },
  chip: { flex: 1 },
  customRow: { marginTop: space.lg, gap: space.sm },
  customLabel: {},
  projLine: { marginTop: space.lg },
  note: { marginTop: space.lg },
  explainer: { marginTop: space.xl, gap: space.md },
  explainerHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  explainerBody: {},
  cta: { marginTop: space.xxl },
});
