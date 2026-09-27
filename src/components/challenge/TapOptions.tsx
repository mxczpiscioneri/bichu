import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { Challenge, ChallengeOption } from '@/challenges/types';
import { colors, radius, shadows, spacing } from '@/theme';

import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';
import { OptionContent } from './OptionContent';

export type OptionStatus = 'idle' | 'tried' | 'correct';

interface TapOptionsProps {
  challenge: Challenge;
  statusOf: (optionId: string) => OptionStatus;
  onChoose: (option: ChallengeOption) => void;
  disabled: boolean;
}

function OptionCard({
  option,
  status,
  onChoose,
  disabled,
  imageSize,
}: {
  option: ChallengeOption;
  status: OptionStatus;
  onChoose: () => void;
  disabled: boolean;
  imageSize: number;
}) {
  const shake = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (status === 'tried') {
      shake.set(
        withSequence(
          withTiming(-10, { duration: 60 }),
          withTiming(10, { duration: 80 }),
          withTiming(-6, { duration: 70 }),
          withTiming(0, { duration: 60 }),
        ),
      );
    }
    if (status === 'correct') pop.set(withSequence(withSpring(1.08, { damping: 8 }), withSpring(1)));
  }, [pop, shake, status]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }, { scale: pop.get() }] }));

  return (
    <Animated.View style={[styles.cardWrap, style]}>
      <PressableScale
        onPress={onChoose}
        disabled={disabled || status !== 'idle'}
        accessibilityLabel={option.label}
        accessibilityState={{ disabled: status === 'tried', selected: status === 'correct' }}
        style={[styles.card, status === 'correct' && styles.cardCorrect, status === 'tried' && styles.cardTried]}>
        <OptionContent option={option} size={imageSize} />
        {status === 'correct' ? (
          <View style={styles.badge}>
            <Icon name="check" size={34} />
          </View>
        ) : null}
      </PressableScale>
    </Animated.View>
  );
}

/** Tall picture cards side by side (2 for Explorers, 3 for Adventurers). */
export function TapOptions({ challenge, statusOf, onChoose, disabled }: TapOptionsProps) {
  const count = challenge.options.length;
  const imageSize = count <= 2 ? 128 : 88;
  return (
    <View style={styles.row}>
      {challenge.options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          status={statusOf(option.id)}
          onChoose={() => onChoose(option)}
          disabled={disabled}
          imageSize={imageSize}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm + 4 },
  cardWrap: { flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 190,
    borderWidth: 4,
    borderColor: 'transparent',
    ...shadows.card,
  },
  cardCorrect: { borderColor: colors.leaf, backgroundColor: colors.leafSoft },
  cardTried: { opacity: 0.4 },
  badge: { position: 'absolute', top: -12, right: -8 },
});
