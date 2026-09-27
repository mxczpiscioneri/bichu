import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type View, type ViewStyle } from 'react-native';
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

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Worklet: window-space rectangle of a mounted view. */
function windowRect(ref: AnimatedRef<View>): Rect | null {
  'worklet';
  const m = measure(ref);
  return m ? { x: m.pageX, y: m.pageY, width: m.width, height: m.height } : null;
}

interface DraggableProps {
  children: ReactNode;
  targets: AnimatedRef<View>[];
  /** Index of the target where this item belongs (-1: nowhere). It snaps there. */
  correctTarget: number;
  /** Called on the JS thread whenever the item is dropped on a target. */
  onDrop: (targetIndex: number) => void;
  /** Target chosen by a simple tap (-1 disables tap-to-send). */
  tapTarget?: number;
  /** Extra tolerance around targets: toddlers must not need precision. */
  tolerance?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

/** Drag with a soft return on a miss/wrong target and a snap into the right one. */
export function Draggable({
  children,
  targets,
  correctTarget,
  onDrop,
  tapTarget = -1,
  tolerance = 48,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}: DraggableProps) {
  const selfRef = useAnimatedRef<View>();
  const origin = useSharedValue<Rect | null>(null);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const lifted = useSharedValue(0);

  const settle = (dx: number, dy: number, forcedTarget: number) => {
    'worklet';
    const from = origin.get() ?? windowRect(selfRef);
    if (!from) return;
    const cx = from.x + from.width / 2 + dx;
    const cy = from.y + from.height / 2 + dy;
    let hit = forcedTarget;
    let hitRect: Rect | null = forcedTarget >= 0 ? windowRect(targets[forcedTarget]) : null;
    if (hit < 0) {
      for (let i = 0; i < targets.length; i += 1) {
        const r = windowRect(targets[i]);
        if (
          r &&
          cx > r.x - tolerance &&
          cx < r.x + r.width + tolerance &&
          cy > r.y - tolerance &&
          cy < r.y + r.height + tolerance
        ) {
          hit = i;
          hitRect = r;
          break;
        }
      }
    }
    if (hit >= 0) scheduleOnRN(onDrop, hit);
    if (hit >= 0 && hit === correctTarget && hitRect) {
      x.set(withSpring(hitRect.x + hitRect.width / 2 - (from.x + from.width / 2), { damping: 14 }));
      y.set(withSpring(hitRect.y + hitRect.height / 2 - (from.y + from.height / 2), { damping: 14 }));
      scale.set(withSequence(withSpring(1.2), withSpring(1)));
      return;
    }
    // Gentle return — no harsh "wrong" feedback.
    x.set(withSpring(0, { damping: 16 }));
    y.set(withSpring(0, { damping: 16 }));
    scale.set(withSequence(withTiming(0.92, { duration: 90 }), withSpring(1)));
  };

  /* eslint-disable react-hooks/refs -- gesture callbacks are UI-thread worklets that run on touch
     events, never during render; the compiler cannot see that and flags the animated refs. */
  const pan = Gesture.Pan()
    .enabled(!disabled)
    .minDistance(4)
    .onBegin(() => {
      // Measured on grab (at rest), so scrolling since layout doesn't matter.
      origin.set(windowRect(selfRef));
      lifted.set(withTiming(1, { duration: 120 }));
      scale.set(withSpring(1.1));
    })
    .onUpdate((event) => {
      x.set(event.translationX);
      y.set(event.translationY);
    })
    .onEnd((event) => {
      settle(event.translationX, event.translationY, -1);
    })
    .onFinalize(() => {
      lifted.set(withTiming(0, { duration: 160 }));
    });
  const tap = Gesture.Tap()
    .enabled(!disabled && tapTarget >= 0)
    .onEnd(() => {
      origin.set(windowRect(selfRef));
      settle(0, 0, tapTarget);
    });
  /* eslint-enable react-hooks/refs */

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: scale.get() }],
    zIndex: lifted.get() > 0 ? 10 : 1,
    boxShadow: lifted.get() > 0 ? '0px 16px 24px rgba(116, 66, 31, 0.25)' : '0px 6px 18px rgba(116, 66, 31, 0.10)',
  }));

  return (
    <GestureDetector gesture={Gesture.Race(pan, tap)}>
      <Animated.View
        style={[style, animatedStyle]}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        onAccessibilityTap={tapTarget >= 0 ? () => scheduleOnUI(settle, 0, 0, tapTarget) : undefined}>
        {/* Measured separately: GestureDetector needs its own ref on the outer view. */}
        <Animated.View ref={selfRef} collapsable={false} style={styles.fill}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fill: { alignItems: 'center', justifyContent: 'center' },
});
