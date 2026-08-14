import { useMemo } from 'react';
import { useGoalStore } from './goal';
import { assumedGrowthPa } from '@/mocks';
import {
  progressPct,
  progressPercentLabel,
  daysToGoal,
  projectedCompletionDate,
  dailyEarnings,
  runwayDays,
  projectedRunwayDays,
  extraRunwayDays,
} from '@/lib/calc';

/**
 * Single source of truth for DERIVED goal metrics. Every screen reads these instead of
 * recomputing — change a base value in the store and all screens update consistently.
 */
export function useGoalMetrics() {
  const goal = useGoalStore((s) => s.activeGoal);
  const contributions = useGoalStore((s) => s.contributions);

  return useMemo(() => {
    if (!goal) return null;
    const dailyPace = goal.dailyContribution;
    const days = daysToGoal(goal.currentSaved, goal.target, dailyPace);
    const targetDays = (goal.timelineYears ?? 0) * 365;
    return {
      goal,
      progress: progressPct(goal.currentSaved, goal.target),
      pctLabel: progressPercentLabel(goal.currentSaved, goal.target),
      currentSaved: goal.currentSaved,
      target: goal.target,
      remaining: Math.max(goal.target - goal.currentSaved, 0),
      dailyPace,
      monthlyPace: dailyPace * 30,
      daysToGoal: days,
      completionDate: projectedCompletionDate(goal.currentSaved, goal.target, dailyPace),
      onTrack: targetDays > 0 ? days <= targetDays : true,
      overnightEarnings: Math.max(Math.round(dailyEarnings(goal.currentSaved, assumedGrowthPa)), 1),
      addedThisSession: contributions.reduce((sum, c) => sum + c.amount, 0),
    };
  }, [goal, contributions]);
}

/** Single source of truth for DERIVED freedom (runway) metrics. */
export function useFreedomMetrics() {
  const freedom = useGoalStore((s) => s.freedom);

  return useMemo(() => {
    const { currentWealth, monthlyCost, dailyContribution } = freedom;
    return {
      freedom,
      runwayDays: runwayDays(currentWealth, monthlyCost),
      projectedRunwayDays: projectedRunwayDays(currentWealth, monthlyCost, dailyContribution),
      extraRunwayDays: extraRunwayDays(currentWealth, monthlyCost, dailyContribution),
    };
  }, [freedom]);
}
