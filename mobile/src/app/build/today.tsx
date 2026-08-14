import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { JourneyHeader } from '@/components/JourneyHeader';
import { ConsistencyChip } from '@/components/ConsistencyChip';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { TabBar } from '@/components/TabBar';
import { InfoNote } from '@/components/InfoNote';
import { useGoalStore } from '@/store/goal';
import { assumedGrowthPa, dailyLessons } from '@/mocks';
import { dailyEarnings, dayIndex, formatINR } from '@/lib/calc';
import { color as C, space } from '@/theme/tokens';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Today() {
  const router = useRouter();
  const user = useGoalStore((s) => s.user);
  const goal = useGoalStore((s) => s.activeGoal);
  const freedom = useGoalStore((s) => s.freedom);
  const consistencyDays = useGoalStore((s) => s.consistencyDays);

  const invested = goal?.currentSaved ?? freedom.currentWealth;
  const overnight = Math.max(Math.round(dailyEarnings(invested, assumedGrowthPa)), 1);
  const lesson = dailyLessons[dayIndex() % dailyLessons.length];

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <Button label="Add today's investment" icon="plus" onPress={() => router.push('/build/add')} />
          <Button label="Continue to my goal" variant="ghost" onPress={() => router.replace('/build/goal')} />
        </View>
      }>
      <JourneyHeader parent="/build/goal" />

      <Text variant="label" color={C.textSecondary} style={styles.greeting}>
        {greeting()}, {user.name}
      </Text>

      {/* Overnight growth — the daily positive, counting up */}
      <Animated.View entering={FadeIn.duration(400)}>
        <Text variant="hero">While you were away,{'\n'}your money earned</Text>
        <AnimatedNumber
          value={overnight}
          variant="hero"
          color={C.green}
          duration={1100}
          format={(n) => `+${formatINR(n)}`}
          style={styles.overnight}
        />
      </Animated.View>
      <Text variant="body" color={C.textSecondary} style={styles.subline}>
        You did nothing. It worked on its own — that&apos;s your money at work.
      </Text>

      {/* Consistency — forgiving, celebratory */}
      <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.streakRow}>
        <ConsistencyChip days={consistencyDays} />
        <Text variant="caption" color={C.textSecondary} style={styles.streakNote}>
          Consistency compounds. Miss a day? Nothing is lost — just pick back up.
        </Text>
      </Animated.View>

      {/* Daily micro-lesson — teaches investing every day */}
      <Animated.View entering={FadeInDown.delay(220).duration(400)}>
        <Card style={styles.lesson}>
          <View style={styles.lessonHead}>
            <Icon name="info" size={16} color={C.green} />
            <Text variant="micro" color={C.green} style={styles.lessonEyebrow}>
              TODAY&apos;S 20-SECOND LESSON
            </Text>
          </View>
          <Text variant="titleLg" style={styles.lessonTitle}>
            {lesson.title}
          </Text>
          <Text variant="body" color={C.textNear}>
            {lesson.body}
          </Text>
          <Button label="See how it grows" variant="secondary" onPress={() => router.push('/build/compounding')} style={styles.lessonBtn} />
        </Card>
      </Animated.View>

      <View style={styles.note}>
        <InfoNote>
          Overnight figure is illustrative, based on an assumed {(assumedGrowthPa * 100).toFixed(0)}% p.a.
          return — not guaranteed, subject to market risk.
        </InfoNote>
      </View>

      <View style={styles.tabWrap}>
        <TabBar />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { marginTop: space.sm, marginBottom: space.md },
  overnight: { marginTop: space.xs },
  subline: { marginTop: space.md },
  tabWrap: { marginTop: space.xxl },
  streakRow: { marginTop: space.xl, gap: space.sm },
  streakNote: {},
  lesson: { marginTop: space.xl, gap: space.md },
  lessonHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  lessonEyebrow: { letterSpacing: 1.2 },
  lessonTitle: {},
  lessonBtn: { marginTop: space.xs },
  note: { marginTop: space.xl },
  footer: { gap: space.xs },
});
