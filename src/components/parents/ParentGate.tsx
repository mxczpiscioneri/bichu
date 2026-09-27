import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, radius, spacing } from '@/theme';

import { AppText } from '../ui/AppText';

const HOLD_MS = 2500;

/** Press-and-hold gate: easy for adults, unlikely to be triggered by a toddler. */
export function ParentGate({ onUnlock }: { onUnlock: () => void }) {
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holding, setHolding] = useState(false);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const start = () => {
    setHolding(true);
    progress.set(withTiming(1, { duration: HOLD_MS }));
    timer.current = setTimeout(onUnlock, HOLD_MS);
  };
  const cancel = () => {
    setHolding(false);
    cancelAnimation(progress);
    progress.set(withTiming(0, { duration: 200 }));
    if (timer.current) clearTimeout(timer.current);
  };

  const fill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View style={styles.root}>
      <AppText variant="heading" align="center">
        Área dos adultos
      </AppText>
      <AppText variant="body" align="center">
        Mantenha o botão pressionado por alguns segundos para continuar.
      </AppText>
      <Pressable
        onPressIn={start}
        onPressOut={cancel}
        accessibilityRole="button"
        accessibilityLabel="Segure para entrar na área dos adultos"
        style={styles.button}>
        <Animated.View style={[styles.fill, fill]} />
        <AppText variant="label" color={colors.white}>
          {holding ? 'Continue segurando…' : 'Segure aqui'}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md, alignItems: 'stretch' },
  button: {
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.cacao,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.forest },
});
