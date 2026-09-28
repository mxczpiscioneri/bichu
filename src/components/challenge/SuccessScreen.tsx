import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ChallengeOption } from '@/challenges/types';
import { useLayout } from '@/hooks/useLayout';
import { colors, radius, spacing } from '@/theme';

import { AnimalArt } from '../animal/AnimalArt';
import { Mascot } from '../brand/Mascot';
import { AppText } from '../ui/AppText';
import { BigButton } from '../ui/BigButton';
import { HabitatScene, Spotlight } from '../ui/HabitatScene';
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
  const { isTablet } = useLayout();
  const art = Math.round(112 * (isTablet ? 1.8 : 1));
  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.root}>
      <HabitatScene scene="forest" backdrop />
      <View style={[styles.top, { paddingTop: insets.top + spacing.lg }]}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.mascot}>
          <Spotlight size={isTablet ? 440 : 270} style={styles.spot} />
          <Mascot pose="cheer" height={isTablet ? 340 : 210} />
          <View style={styles.star}>
            <Icon name="glowing" size={isTablet ? 130 : 84} />
          </View>
        </Animated.View>
      </View>
      <View style={[styles.panel, isTablet && styles.panelTablet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <AppText variant={isTablet ? 'hero' : 'title'} align="center">
          {title}
        </AppText>
        <AppText variant={isTablet ? 'heading' : 'subheading'} align="center" color={colors.ink}>
          {explanation}
        </AppText>
        {answer?.icon ? <Icon name={answer.icon} size={art} /> : null}
        {answer?.animalId ? <AnimalArt animalId={answer.animalId} size={art} /> : null}
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
          style={[styles.button, isTablet && styles.buttonTablet]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, zIndex: 20, backgroundColor: colors.forest },
  top: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mascot: { alignItems: 'center', justifyContent: 'center' },
  spot: { alignSelf: 'center' },
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
  panelTablet: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, gap: spacing.lg },
  // A full-width button on a 13" iPad is a long reach; keep it thumb-sized and centred.
  buttonTablet: { alignSelf: 'center', width: 520 },
});
