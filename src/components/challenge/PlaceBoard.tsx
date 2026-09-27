import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import { isCorrect, type Challenge, type ChallengeOption } from '@/challenges/types';
import { HABITATS, isOneOf } from '@/domain/taxonomy';
import { colors, fonts, radius, shadows, spacing } from '@/theme';

import { AnimalMedallion } from '../animal/AnimalMedallion';
import { AppText } from '../ui/AppText';
import { HabitatScene, sceneForHabitat } from '../ui/HabitatScene';
import { PressableScale } from '../ui/PressableScale';
import { Draggable } from './Draggable';
import type { OptionStatus } from './TapOptions';

interface BoardProps {
  challenge: Challenge;
  statusOf: (optionId: string) => OptionStatus;
  onChoose: (option: ChallengeOption) => boolean;
  disabled: boolean;
}

const MAX_OPTIONS = 4;

/**
 *   🦁  →  [ Savana ]
 *          [ Floresta ]
 * The child brings the animal home. Tapping a place also answers.
 */
export function PlaceBoard({ challenge, statusOf, onChoose, disabled }: BoardProps) {
  // Hooks can't live in loops: a fixed set of refs covers every level (≤ 4 options).
  const ref0 = useAnimatedRef<View>();
  const ref1 = useAnimatedRef<View>();
  const ref2 = useAnimatedRef<View>();
  const ref3 = useAnimatedRef<View>();
  const options = challenge.options.slice(0, MAX_OPTIONS);
  const refs = [ref0, ref1, ref2, ref3].slice(0, options.length);
  const correctIndex = options.findIndex((o) => isCorrect(challenge, o.id));

  return (
    <View style={styles.board}>
      <View style={styles.animalColumn}>
        <Draggable
          targets={refs}
          correctTarget={correctIndex}
          onDrop={(index) => onChoose(options[index])}
          tolerance={12}
          disabled={disabled}
          accessibilityLabel="Arraste o animal até o lugar certo"
          style={styles.animalToken}>
          <AnimalMedallion animalId={challenge.animalId} size={84} />
        </Draggable>
      </View>
      <View style={styles.places}>
        {options.map((option, index) => {
          const status = statusOf(option.id);
          return (
            <Animated.View
              key={option.id}
              ref={refs[index]}
              style={[styles.placeWrap, { aspectRatio: options.length > 2 ? 1.7 : 1.3 }]}>
              <PressableScale
                onPress={() => onChoose(option)}
                disabled={disabled || status !== 'idle'}
                accessibilityLabel={option.label}
                accessibilityState={{ disabled: status === 'tried', selected: status === 'correct' }}
                style={[styles.place, status === 'tried' && styles.tried, status === 'correct' && styles.correct]}
                pressedScale={0.98}>
                {isOneOf(HABITATS, option.id) ? <HabitatScene scene={sceneForHabitat(option.id)} /> : null}
                <View style={styles.label}>
                  <AppText style={styles.labelText}>{option.label}</AppText>
                </View>
              </PressableScale>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: { flex: 1, flexDirection: 'row', gap: spacing.md },
  animalColumn: { width: 108, alignItems: 'center', justifyContent: 'center' },
  animalToken: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.sm, ...shadows.card },
  places: { flex: 1, gap: spacing.md, justifyContent: 'center' },
  placeWrap: { width: '100%' },
  place: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'transparent',
    ...shadows.card,
  },
  tried: { opacity: 0.4 },
  correct: { borderColor: colors.sun },
  label: {
    position: 'absolute',
    top: spacing.sm + 2,
    left: spacing.sm + 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 3,
  },
  labelText: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.forest },
});
