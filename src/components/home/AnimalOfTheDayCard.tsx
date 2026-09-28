import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Animal } from '@/domain/animal';
import { colors, fonts, radius, shadows, spacing } from '@/theme';

import { AnimalArt } from '../animal/AnimalArt';
import { AppText } from '../ui/AppText';
import { HabitatScene, sceneForAnimal } from '../ui/HabitatScene';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

export function AnimalOfTheDayCard({ animal }: { animal: Animal }) {
  const open = () => router.push({ pathname: '/animal/[id]', params: { id: animal.id } });
  return (
    <PressableScale
      onPress={open}
      accessibilityLabel={`Animal do dia: ${animal.name.ptBR}. Descobrir`}
      style={styles.card}
      pressedScale={0.98}>
      <HabitatScene scene={sceneForAnimal(animal)} />
      <View style={styles.text}>
        <View style={styles.tag}>
          <AppText variant="overline" color={colors.forest} numberOfLines={1}>
            Animal do dia
          </AppText>
        </View>
        <AppText variant="title" numberOfLines={1} adjustsFontSizeToFit style={styles.name}>
          {animal.name.ptBR}
        </AppText>
        {animal.content.preschool[0] ? (
          <AppText variant="caption" color={colors.ink} numberOfLines={2}>
            {animal.content.preschool[0]}
          </AppText>
        ) : null}
        <View style={styles.cta}>
          <View style={styles.play}>
            <Icon name="play-fill" size={20} />
          </View>
          <AppText style={styles.ctaLabel} numberOfLines={1}>
            Descobrir
          </AppText>
        </View>
      </View>
      <View style={styles.image}>
        <AnimalArt animalId={animal.id} size={112} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 208,
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: spacing.md + 2,
    gap: spacing.sm,
    ...shadows.raised,
  },
  // Soft panel keeps the text readable over the painted scene.
  // Fixed share of the card: the art is fixed-size, so a flex panel got squeezed.
  text: {
    width: '60%',
    gap: 6,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(251, 245, 232, 0.88)',
    borderRadius: radius.md,
    padding: spacing.sm + 4,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.terra,
    borderRadius: radius.pill,
    paddingLeft: 6,
    paddingRight: spacing.md + 2,
    minHeight: 48,
    boxShadow: '0px 4px 0px rgba(160, 70, 20, 0.35)',
  },
  play: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.white },
  image: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 28, lineHeight: 34 },
});
