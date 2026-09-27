import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import { isCorrect, type Challenge, type ChallengeOption } from '@/challenges/types';
import { getAnimal } from '@/content/animals';
import { colors, radius, shadows, spacing } from '@/theme';

import { AnimalArt } from '../animal/AnimalArt';
import { AppText } from '../ui/AppText';
import { HabitatScene, sceneForAnimal } from '../ui/HabitatScene';
import { Draggable } from './Draggable';
import { OptionContent } from './OptionContent';
import type { OptionStatus } from './TapOptions';

interface BoardProps {
  challenge: Challenge;
  statusOf: (optionId: string) => OptionStatus;
  onChoose: (option: ChallengeOption) => boolean;
  disabled: boolean;
}

/**
 *     [ animal on its scene ]   ← drop target
 *   🥩        🍌        🌿      ← drag (or tap) one
 */
export function DragBoard({ challenge, statusOf, onChoose, disabled }: BoardProps) {
  const slotRef = useAnimatedRef<View>();
  const [solved, setSolved] = useState(false);
  const animal = getAnimal(challenge.animalId);

  return (
    <View style={styles.board}>
      <View style={styles.stage}>
        {animal ? <HabitatScene scene={sceneForAnimal(animal)} /> : null}
        <Animated.View ref={slotRef} style={[styles.slot, solved && styles.slotSolved]}>
          <AnimalArt animalId={challenge.animalId} size={176} />
        </Animated.View>
        {!solved ? (
          <View style={styles.hint}>
            <AppText variant="caption" color={colors.cacao}>
              Arraste até aqui
            </AppText>
          </View>
        ) : null}
      </View>
      <View style={styles.tokens}>
        {challenge.options.map((option) => {
          const status = statusOf(option.id);
          return (
            <Draggable
              key={option.id}
              targets={[slotRef]}
              correctTarget={isCorrect(challenge, option.id) ? 0 : -1}
              tapTarget={0}
              tolerance={72}
              disabled={disabled || status !== 'idle'}
              onDrop={() => {
                if (onChoose(option)) setSolved(true);
              }}
              accessibilityLabel={option.label}
              accessibilityHint="Arraste até o animal ou toque para escolher"
              style={[
                styles.token,
                (status === 'tried' || (disabled && status === 'idle')) && styles.tokenDim,
                status === 'correct' && styles.tokenCorrect,
              ]}>
              <OptionContent option={option} size={68} />
            </Draggable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { flex: 1, gap: spacing.md },
  stage: {
    flex: 1,
    minHeight: 260,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  slot: { borderRadius: 999, padding: 6, borderWidth: 4, borderStyle: 'dashed', borderColor: colors.white },
  slotSolved: { borderStyle: 'solid', borderColor: colors.sun },
  hint: {
    position: 'absolute',
    bottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  tokens: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm + 4 },
  token: {
    flex: 1,
    maxWidth: 124,
    minHeight: 124,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
  },
  tokenDim: { opacity: 0.45 },
  tokenCorrect: { borderColor: colors.sun },
});
