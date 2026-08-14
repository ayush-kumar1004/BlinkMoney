import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display';
import {
  Mulish_400Regular,
  Mulish_500Medium,
  Mulish_600SemiBold,
  Mulish_700Bold,
} from '@expo-google-fonts/mulish';
import { color as C } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Anchor deep links / reloads to the entry screen so the Stack always has a valid back target
// (prevents expo-router's web "GO_BACK not handled" reconciliation warning on direct loads).
export const unstable_settings = { initialRouteName: 'index' };

// Extra safety net for the dev overlay (native + web); production never emits this.
LogBox.ignoreLogs(["The action 'GO_BACK' was not handled by any navigator"]);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_500Medium,
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // Render once fonts load OR fail — never leave a blank screen if a font asset 404s (e.g. a host
  // that strips node_modules paths); the app falls back to system fonts instead.
  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: C.bg },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="build/today" options={{ animation: 'fade' }} />
          <Stack.Screen name="build/compounding" options={{ animation: 'fade' }} />
          <Stack.Screen name="build/milestone" options={{ animation: 'fade' }} />
          <Stack.Screen name="build/add" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="build/share" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
