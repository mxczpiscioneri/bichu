import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type AnimatedRef,
} from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

import { isCorrect, type Challenge, type ChallengeOption } from '@/challenges/types';
import { colors, radius, shadows, spacing } from '@/theme';

import { AnimalImage } from '../animal/AnimalImage';
import { AppText } from '../ui/AppText';
import { OptionContent } from './OptionContent';
import type { OptionStatus } from './TapOptions';

/** Extra tolerance around the slot: toddlers must not need precision. */
const DROP_TOLERANCE = 72;

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragBoardProps {
  challenge: Challenge;
  statusOf: (optionId: string) => OptionStatus;
  onChoose: (option: ChallengeOption) => boolean;
  disabled: boolean;
}

interface TokenProps {
  option: ChallengeOption;
  correct: boolean;
  status: OptionStatus;
  disabled: boolean;
  slotRef: AnimatedRef<View>;
  onDrop: (option: ChallengeOption) => void;
}

/** Worklet: window-space rectangle of a mounted view. */
function windowRect(ref: AnimatedRef<View>): Rect | null {
  'worklet';
  const m = measure(ref);
  return m ? { x: m.pageX, y: m.pageY, width: m.width, height: m.height } : null;
}

function DraggableToken({ option, correct, status, disabled, slotRef, onDrop }: TokenProps) {
  const tokenRef = useAnimatedRef<View>();
  const origin = useSharedValue<Rect | null>(null);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const lifted = useSharedValue(0);

  /** Worklet: animate to the slot (right answer) or softly back (anything else). */
  const settle = (dx: number, dy: number, forceHit: boolean) => {
    'worklet';
    const from = origin.get() ?? windowRect(tokenRef);
    const target = windowRect(slotRef);
    if (!from || !target) {
      x.set(withSpring(0));
      y.set(withSpring(0));
      return;
    }
    const cx = from.x + from.width / 2 + dx;
    const cy = from.y + from.height / 2 + dy;
    const hit =
      forceHit ||
      (cx > target.x - DROP_TOLERANCE &&
        cx < target.x + target.width + DROP_TOLERANCE &&
        cy > target.y - DROP_TOLERANCE &&
        cy < target.y + target.height + DROP_TOLERANCE);

    if (hit) scheduleOnRN(onDrop, option);
    if (hit && correct) {
      x.set(withSpring(target.x + target.width / 2 - (from.x + from.width / 2), { damping: 14 }));
      y.set(withSpring(target.y + target.height / 2 - (from.y + from.height / 2), { damping: 14 }));
      scale.set(withSequence(withSpring(1.25), withSpring(1.05)));
      return;
    }
    // Gentle return — no harsh "wrong" feedback.
    x.set(withSpring(0, { damping: 16 }));
    y.set(withSpring(0, { damping: 16 }));
    scale.set(withSequence(withTiming(0.92, { duration: 90 }), withSpring(1)));
  };

  const locked = disabled || status !== 'idle';
  /* eslint-disable react-hooks/refs -- gesture callbacks are UI-thread worklets that run on touch
     events, never during render; the compiler cannot see that and flags the animated refs. */
  const pan = Gesture.Pan()
    .enabled(!locked)
    .minDistance(4)
    .onBegin(() => {
      // Measured on grab (at rest), so scrolling since layout doesn't matter.
      origin.set(windowRect(tokenRef));
      lifted.set(withTiming(1, { duration: 120 }));
      scale.set(withSpring(1.1));
    })
    .onUpdate((event) => {
      x.set(event.translationX);
      y.set(event.translationY);
    })
    .onEnd((event) => {
      settle(event.translationX, event.translationY, false);
    })
    .onFinalize(() => {
      lifted.set(withTiming(0, { duration: 160 }));
    });
  // Tapping a token also "sends" it to the slot.
  const tap = Gesture.Tap()
    .enabled(!locked)
    .onEnd(() => {
      origin.set(windowRect(tokenRef));
      settle(0, 0, true);
    });
  /* eslint-enable react-hooks/refs */

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: scale.get() }],
    zIndex: lifted.get() > 0 ? 10 : 1,
    boxShadow: lifted.get() > 0 ? '0px 16px 24px rgba(116, 66, 31, 0.25)' : '0px 6px 18px rgba(116, 66, 31, 0.10)',
  }));

  return (
    <GestureDetector gesture={Gesture.Race(pan, tap)}>
      <Animated.View
        style={[
          styles.token,
          (status === 'tried' || (disabled && status === 'idle')) && styles.tokenTried,
          status === 'correct' && styles.tokenCorrect,
          style,
        ]}
        accessible
        accessibilityLabel={option.label}
        accessibilityHint="Arraste até o animal ou toque para escolher"
        onAccessibilityTap={() => scheduleOnUI(settle, 0, 0, true)}>
        {/* Measured separately: GestureDetector needs its own ref on the outer view. */}
        <Animated.View ref={tokenRef} collapsable={false}>
          <OptionContent option={option} size={72} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

/**
 *            LEÃO
 *          [ SLOT ]
 *   🥩        🍌        🌿
 */
export function DragBoard({ challenge, statusOf, onChoose, disabled }: DragBoardProps) {
  const slotRef = useAnimatedRef<View>();
  const [solved, setSolved] = useState(false);

  const handleDrop = (option: ChallengeOption) => {
    if (onChoose(option)) setSolved(true);
  };

  return (
    <View style={styles.board}>
      <Animated.View ref={slotRef} style={[styles.slot, solved && styles.slotSolved]}>
        <AnimalImage animalId={challenge.animalId} size={168} />
        {!solved ? (
          <View style={styles.hint}>
            <AppText variant="caption" color={colors.cacao}>
              Arraste até aqui
            </AppText>
          </View>
        ) : null}
      </Animated.View>
      <View style={styles.tokens}>
        {challenge.options.map((option) => (
          <DraggableToken
            key={option.id}
            option={option}
            correct={isCorrect(challenge, option.id)}
            status={statusOf(option.id)}
            disabled={disabled}
            slotRef={slotRef}
            onDrop={handleDrop}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { alignItems: 'center', gap: spacing.xl, flex: 1, justifyContent: 'space-evenly' },
  slot: {
    width: 232,
    height: 232,
    borderRadius: 116,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 4,
    borderStyle: 'dashed',
    borderColor: colors.leaf,
  },
  slotSolved: { borderStyle: 'solid', borderColor: colors.sun, backgroundColor: colors.white },
  hint: {
    position: 'absolute',
    bottom: -14,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    ...shadows.card,
  },
  tokens: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' },
  token: {
    width: 104,
    minHeight: 124,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  tokenTried: { opacity: 0.45 },
  tokenCorrect: { borderColor: colors.sun },
});
