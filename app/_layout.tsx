import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_600SemiBold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { screenNameFor, setAnalyticsEnabled, track, trackScreen } from '@/analytics';
import { AnimatedSplash } from '@/components/brand/AnimatedSplash';
import { useListeningTracker } from '@/progress/useListeningTracker';
import { useStoresHydrated } from '@/stores/hydration';
import { useSettingsStore } from '@/stores/settingsStore';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync();

// Once per JS start; queued until the saved settings say whether statistics are allowed.
track('app_open');

/** Anonymous usage statistics: follows the parents' switch and reports screen changes. */
function useAnalytics(hydrated: boolean, ready: boolean) {
  const analyticsEnabled = useSettingsStore((state) => state.analyticsEnabled);
  useEffect(() => {
    if (hydrated) setAnalyticsEnabled(analyticsEnabled !== false);
  }, [hydrated, analyticsEnabled]);

  // Before `ready` no navigator is mounted and the segments are empty: report nothing yet.
  const segments = useSegments();
  const screen = ready ? screenNameFor(segments) : null;
  const lastScreen = useRef<string | null>(null);
  useEffect(() => {
    if (!screen || screen === lastScreen.current) return;
    lastScreen.current = screen;
    trackScreen(screen);
  }, [screen]);
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
  });
  const hydrated = useStoresHydrated();
  // A font failure must not block the app: system fonts are an acceptable fallback.
  const ready = (fontsLoaded || !!fontError) && hydrated;
  useListeningTracker();
  useAnalytics(hydrated, ready);
  const [introDone, setIntroDone] = useState(false);
  // The animated intro draws the same frame as the native splash, so hide the native one once it is on screen.
  const hideNativeSplash = useCallback(() => void SplashScreen.hideAsync(), []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="animal/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="challenge/[type]" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="ar/[animalId]" options={{ animation: 'fade' }} />
        <Stack.Screen name="parents" options={{ presentation: 'modal' }} />
        <Stack.Screen name="credits" options={{ presentation: 'modal' }} />
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="choose-level" options={{ animation: 'fade' }} />
      </Stack>
      {introDone ? null : <AnimatedSplash onReady={hideNativeSplash} onDone={() => setIntroDone(true)} />}
    </GestureHandlerRootView>
  );
}
