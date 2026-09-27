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
  large,
}: {
  option: ChallengeOption;
  status: OptionStatus;
  onChoose: () => void;
  disabled: boolean;
  large: boolean;
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
        style={[
          styles.card,
          large && styles.cardLarge,
          status === 'correct' && styles.cardCorrect,
          status === 'tried' && styles.cardTried,
        ]}>
        <OptionContent option={option} size={large ? 128 : 88} />
        {status === 'correct' ? (
          <View style={styles.badge}>
            <Icon name="check" size={36} />
          </View>
        ) : null}
      </PressableScale>
    </Animated.View>
  );
}

/** Big picture cards. 2 options side by side; 3+ wrap into two columns. */
export function TapOptions({ challenge, statusOf, onChoose, disabled }: TapOptionsProps) {
  const large = challenge.options.length <= 2;
  return (
    <View style={styles.grid}>
      {challenge.options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          status={statusOf(option.id)}
          onChoose={() => onChoose(option)}
          disabled={disabled}
          large={large}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  cardWrap: { width: '46%', minWidth: 140 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    borderWidth: 4,
    borderColor: 'transparent',
    ...shadows.card,
  },
  cardLarge: { minHeight: 200 },
  cardCorrect: { borderColor: colors.leaf, backgroundColor: colors.leafSoft },
  cardTried: { opacity: 0.4 },
  badge: { position: 'absolute', top: -14, right: -10 },
});
