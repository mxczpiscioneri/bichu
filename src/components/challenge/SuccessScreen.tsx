import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ChallengeOption } from '@/challenges/types';
import { colors, radius, spacing } from '@/theme';

import { AnimalMedallion } from '../animal/AnimalMedallion';
import { Mascot } from '../brand/Mascot';
import { AppText } from '../ui/AppText';
import { BigButton } from '../ui/BigButton';
import { HabitatScene } from '../ui/HabitatScene';
import { Icon } from '../ui/Icon';

interface SuccessScreenProps {
  title: string;
  explanation: string;
  answer: ChallengeOption | undefined;
  earnedStar: boolean;
  isLast: boolean;
  onContinue: () => void;
}

/** Full-screen celebration after a right answer: phrase, one learning sentence, the answer. */
export function SuccessScreen({ title, explanation, answer, earnedStar, isLast, onContinue }: SuccessScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.root}>
      <HabitatScene scene="forest" />
      <View style={[styles.top, { paddingTop: insets.top + spacing.lg }]}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.mascot}>
          <Mascot pose="cheer" height={210} />
          <View style={styles.star}>
            <Icon name="glowing" size={84} />
          </View>
        </Animated.View>
      </View>
      <View style={[styles.panel, { paddingBottom: insets.bottom + spacing.lg }]}>
        <AppText variant="title" align="center">
          {title}
        </AppText>
        <AppText variant="subheading" align="center" color={colors.ink}>
          {explanation}
        </AppText>
        {answer?.icon ? <Icon name={answer.icon} size={112} /> : null}
        {answer?.animalId ? <AnimalMedallion animalId={answer.animalId} size={112} /> : null}
        {earnedStar ? (
          <View style={styles.starChip} accessibilityLabel="Você ganhou uma estrela" accessible>
            <Icon name="star" size={24} />
            <AppText variant="label">+1 estrela</AppText>
          </View>
        ) : null}
        <BigButton
          label={isLast ? 'Terminar' : 'Próximo desafio'}
          icon="footprints"
          onPress={onContinue}
          style={styles.button}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, zIndex: 20, backgroundColor: colors.forest },
  top: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mascot: { alignItems: 'center' },
  star: { position: 'absolute', bottom: -18 },
  panel: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg + 12,
    borderTopRightRadius: radius.lg + 12,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  starChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.sunSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  button: { alignSelf: 'stretch' },
});
