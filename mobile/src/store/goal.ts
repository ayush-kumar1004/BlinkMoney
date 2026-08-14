import { create } from 'zustand';
import {
  contributionOptions,
  seededConsistencyDays,
  seededFreedom,
  seededGoal,
  seededMilestones,
  seededUser,
} from '@/mocks';

export type GoalType = 'bike' | 'car' | 'trip' | 'home' | 'business' | 'custom';
export type Path = 'freedom' | 'dream';

export interface FreedomState {
  monthlyCost: number; // ₹/month (user-entered)
  currentWealth: number; // ₹ (seeded from portfolio, read-only)
  dailyContribution: number; // ₹/day
  assumedReturnPa: number; // illustrative
}

export interface DreamGoal {
  type: GoalType;
  name: string;
  target: number;
  timelineYears?: number;
  currentSaved: number;
  dailyContribution: number;
  createdAt: string;
}

export interface Milestone {
  pct: number;
  label: string;
  unlocked: boolean;
}

interface Draft {
  type: GoalType;
  name: string;
  target: number;
  timelineYears: number;
  dailyContribution: number;
}

interface GoalStore {
  // session
  path?: Path;
  hasCompletedBuildSetup: boolean; // drives entry routing (demo starts false → /build/intro)
  user: typeof seededUser;
  freedom: FreedomState;
  draft: Draft;
  activeGoal?: DreamGoal;
  consistencyDays: number;
  milestones: Milestone[];
  contributions: { date: string; amount: number }[];
  lastMilestone?: Milestone;

  // actions
  setPath: (p: Path) => void;
  completeBuildSetup: () => void;
  resetBuild: () => void;
  setMonthlyCost: (v: number) => void;
  setFreedomContribution: (v: number) => void;
  selectGoalType: (t: GoalType, name?: string) => void;
  setModel: (name: string, target: number) => void;
  setDraftTarget: (v: number) => void;
  setDraftTimeline: (years: number) => void;
  setDraftContribution: (v: number) => void;
  confirmGoal: () => void;
  addContribution: (amount: number) => void;
  reset: () => void;
}

const goalTypeNames: Record<GoalType, string> = {
  bike: 'Dream Bike',
  car: 'Dream Car',
  trip: 'Dream Trip',
  home: 'Dream Home',
  business: 'Dream Business',
  custom: 'Custom Goal',
};

// Drafts pre-filled from the seeded goal so the demo config screen is populated.
const initialDraft: Draft = {
  type: seededGoal.type,
  name: seededGoal.name,
  target: seededGoal.target,
  timelineYears: seededGoal.timelineYears ?? 2,
  dailyContribution: seededGoal.dailyContribution,
};

function recomputeMilestones(milestones: Milestone[], pct: number): Milestone[] {
  return milestones.map((m) => ({ ...m, unlocked: pct >= m.pct }));
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  path: undefined,
  hasCompletedBuildSetup: false, // fresh demo → evaluator always sees /build/intro first
  user: seededUser,
  freedom: { ...seededFreedom },
  draft: { ...initialDraft },
  activeGoal: { ...seededGoal }, // returning user already has an active goal
  consistencyDays: seededConsistencyDays,
  milestones: recomputeMilestones(seededMilestones, seededGoal.currentSaved / seededGoal.target),
  contributions: [],
  lastMilestone: seededMilestones.find((m) => m.unlocked),

  setPath: (p) => set({ path: p }),
  completeBuildSetup: () => set({ hasCompletedBuildSetup: true }),
  resetBuild: () => set({ hasCompletedBuildSetup: false, path: undefined, draft: { ...initialDraft } }),

  setMonthlyCost: (v) => set((s) => ({ freedom: { ...s.freedom, monthlyCost: Math.max(0, v) } })),
  setFreedomContribution: (v) => set((s) => ({ freedom: { ...s.freedom, dailyContribution: v } })),

  selectGoalType: (t, name) =>
    set((s) => ({ draft: { ...s.draft, type: t, name: name ?? goalTypeNames[t] } })),

  setModel: (name, target) => set((s) => ({ draft: { ...s.draft, name, target } })),

  setDraftTarget: (v) => set((s) => ({ draft: { ...s.draft, target: Math.max(0, v) } })),
  setDraftTimeline: (years) => set((s) => ({ draft: { ...s.draft, timelineYears: years } })),
  setDraftContribution: (v) => set((s) => ({ draft: { ...s.draft, dailyContribution: v } })),

  confirmGoal: () =>
    set((s) => {
      const existingSaved = s.activeGoal?.currentSaved ?? 0;
      const goal: DreamGoal = {
        type: s.draft.type,
        name: s.draft.name,
        target: s.draft.target,
        timelineYears: s.draft.timelineYears,
        currentSaved: existingSaved,
        dailyContribution: s.draft.dailyContribution,
        createdAt: s.activeGoal?.createdAt ?? new Date().toISOString(),
      };
      return {
        activeGoal: goal,
        hasCompletedBuildSetup: true,
        milestones: recomputeMilestones(s.milestones, goal.currentSaved / goal.target),
      };
    }),

  addContribution: (amount) =>
    set((s) => {
      if (!s.activeGoal) return {};
      const currentSaved = s.activeGoal.currentSaved + amount;
      const pct = currentSaved / s.activeGoal.target;
      const nextMilestones = recomputeMilestones(s.milestones, pct);
      const newlyUnlocked = nextMilestones.find((m, i) => m.unlocked && !s.milestones[i].unlocked);
      // Consistency counts DAYS you show up — increment at most once per calendar day (forgiving).
      const today = new Date().toDateString();
      const alreadyToday = s.contributions.some((cx) => new Date(cx.date).toDateString() === today);
      return {
        activeGoal: { ...s.activeGoal, currentSaved },
        milestones: nextMilestones,
        contributions: [...s.contributions, { date: new Date().toISOString(), amount }],
        lastMilestone: newlyUnlocked ?? s.lastMilestone,
        consistencyDays: alreadyToday ? s.consistencyDays : s.consistencyDays + 1,
      };
    }),

  reset: () =>
    set({
      path: undefined,
      freedom: { ...seededFreedom },
      draft: { ...initialDraft },
    }),
}));

export { contributionOptions };
