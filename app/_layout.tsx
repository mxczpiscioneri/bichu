import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_600SemiBold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplash } from '@/components/brand/AnimatedSplash';
import { useListeningTracker } from '@/progress/useListeningTracker';
import { useStoresHydrated } from '@/stores/hydration';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync();

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
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="choose-level" options={{ animation: 'fade' }} />
      </Stack>
      {introDone ? null : <AnimatedSplash onReady={hideNativeSplash} onDone={() => setIntroDone(true)} />}
    </GestureHandlerRootView>
  );
}
