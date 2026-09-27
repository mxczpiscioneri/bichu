import * as Haptics from 'expo-haptics';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** How much the element shrinks while pressed. */
  pressedScale?: number;
  haptic?: boolean;
}

/** Soft "squish" feedback used by every tappable surface. */
export function PressableScale({ style, pressedScale = 0.95, haptic = true, onPressIn, onPressOut, onPress, ...rest }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      {...rest}
      onPressIn={(event) => {
        scale.set(withSpring(pressedScale, { damping: 15, stiffness: 400 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, { damping: 12, stiffness: 300 }));
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic && Platform.OS !== 'web') void Haptics.selectionAsync();
        onPress?.(event);
      }}
      style={[style, animatedStyle]}
    />
  );
}
