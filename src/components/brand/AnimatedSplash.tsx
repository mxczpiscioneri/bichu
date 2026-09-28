import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

import { Logo } from './Logo';

/** Same image and width as the native splash (app.config.ts → expo-splash-screen), so the hand-off is seamless. */
const SPLASH_IMAGE = require('../../../assets/brand/splash-icon.png');
const SPLASH_WIDTH = 200;
const SPLASH_RATIO = 487 / 700;
/** The native splash draws the mascot at ~69% of `imageWidth` (measured on iOS); start there and grow. */
const NATIVE_SCALE = 0.69;

const EXIT_AT = 1750;
const EXIT_MS = 420;

const LEAVES = [
  { x: -150, y: -210, rotate: -30, delay: 520, size: 34, color: colors.leaf },
  { x: 140, y: -250, rotate: 25, delay: 620, size: 28, color: colors.forest },
  { x: -120, y: 40, rotate: 60, delay: 700, size: 24, color: colors.forest },
  { x: 165, y: -40, rotate: -50, delay: 560, size: 32, color: colors.leaf },
  { x: -40, y: -300, rotate: 10, delay: 760, size: 22, color: colors.leaf },
  { x: 60, y: 90, rotate: -15, delay: 820, size: 20, color: colors.leaf },
];

function Leaf({ x, y, rotate, delay, size, color, exit }: (typeof LEAVES)[number] & { exit: SharedValue<number> }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withDelay(delay, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) })));
  }, [delay, t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.get() * (1 - exit.get()),
    transform: [
      { translateX: x * t.get() },
      { translateY: y * t.get() + 30 * (1 - t.get()) },
      { rotate: `${rotate * t.get() * 2}deg` },
      { scale: 0.4 + 0.6 * t.get() },
    ],
  }));
  return (
    <Animated.View style={[styles.leaf, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M4 20C4 10 10 4 21 3c-1 11-7 17-17 17Z" fill={color} />
        <Path d="M5 19 16 8" stroke={colors.cream} strokeWidth={1.4} strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
}

/**
 * Picks up where the native splash stops: the mascot hops and says hi, the
 * logo pops in with a few leaves, then everything zooms softly away. Tap to skip;
 * with Reduce Motion it is a plain short fade.
 */
export function AnimatedSplash({ onReady, onDone }: { onReady: () => void; onDone: () => void }) {
  const reduceMotion = useReducedMotion();
  const { height } = useWindowDimensions();
  const [leaving, setLeaving] = useState(false);

  const hop = useSharedValue(0);
  const grow = useSharedValue(NATIVE_SCALE);
  const lift = useSharedValue(0);
  const logo = useSharedValue(0);
  const exit = useSharedValue(0);

  const left = useRef(false);
  const finish = () => {
    if (left.current) return;
    left.current = true;
    setLeaving(true);
    exit.set(
      withTiming(1, { duration: reduceMotion ? 250 : EXIT_MS, easing: Easing.in(Easing.quad) }, (done) => {
        if (done) runOnJS(onDone)();
      }),
    );
  };

  useEffect(() => {
    if (reduceMotion) {
      grow.set(1);
      logo.set(withTiming(1, { duration: 200 }));
      const timer = setTimeout(finish, 700);
      return () => clearTimeout(timer);
    }
    // Hi! — two little hops, then the mascot steps up to make room for the logo.
    hop.set(
      withDelay(
        120,
        withSequence(
          withTiming(-26, { duration: 180, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 160, easing: Easing.in(Easing.quad) }),
          withTiming(-14, { duration: 140, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 130, easing: Easing.in(Easing.quad) }),
          withRepeat(withSequence(withTiming(-6, { duration: 500 }), withTiming(0, { duration: 500 })), -1, true),
        ),
      ),
    );
    grow.set(withDelay(120, withSpring(1, { damping: 12, stiffness: 110 })));
    lift.set(withDelay(520, withSpring(1, { damping: 14, stiffness: 120 })));
    logo.set(withDelay(640, withSpring(1, { damping: 11, stiffness: 140 })));
    const timer = setTimeout(finish, EXIT_AT);
    return () => clearTimeout(timer);
    // The intro runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mascotHeight = SPLASH_WIDTH / SPLASH_RATIO;
  const liftBy = Math.min(110, height * 0.12);

  const rootStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.get() }));
  const stageStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + exit.get() * 0.25 }] }));
  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hop.get() - liftBy * lift.get() }, { rotate: `${hop.get() * -0.25}deg` }],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, logo.get() * 1.4),
    transform: [
      { translateY: (1 - logo.get()) * 40 - liftBy * lift.get() + mascotHeight / 2 + 70 },
      { scale: 0.7 + 0.3 * logo.get() },
    ],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, rootStyle]} pointerEvents={leaving ? 'none' : 'auto'}>
      <Pressable style={StyleSheet.absoluteFill} onPress={finish} accessibilityLabel="Pular abertura">
        <View style={styles.center}>
          <Animated.View style={[styles.center, stageStyle]}>
            {reduceMotion ? null : LEAVES.map((leaf, i) => <Leaf key={i} {...leaf} exit={exit} />)}
            <Animated.View style={mascotStyle}>
              <Image
                source={SPLASH_IMAGE}
                style={{ width: SPLASH_WIDTH, height: mascotHeight }}
                contentFit="contain"
                // Swap from the native splash only once this frame can be drawn (no blank flash).
                onLoad={onReady}
                onError={onReady}
              />
            </Animated.View>
            <Animated.View style={[styles.logo, logoStyle]}>
              <Logo width={240} />
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { zIndex: 100, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { position: 'absolute' },
  leaf: { position: 'absolute' },
});
