import { Redirect } from 'expo-router';
import { useGoalStore } from '@/store/goal';
import Intro from './build/intro';

// Entry routing (assignment demo starts fresh → always shows the new feature first):
// - hasCompletedBuildSetup === false → render the Build Intro directly at "/" (no redirect, so
//   there's nothing for expo-router's web stack to reconcile → no GO_BACK warning on cold load).
// - hasCompletedBuildSetup === true  → the main goal dashboard.
// The Today/Daily screen is NEVER the initial route; it's reachable after setup.
export default function Index() {
  const done = useGoalStore((s) => s.hasCompletedBuildSetup);
  if (done) return <Redirect href="/build/goal" />;
  return <Intro />;
}
