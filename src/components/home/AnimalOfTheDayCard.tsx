import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Animal } from '@/domain/animal';
import { colors, fonts, radius, shadows, spacing } from '@/theme';

import { AnimalArt } from '../animal/AnimalArt';
import { AppText } from '../ui/AppText';
import { HabitatScene, sceneForAnimal } from '../ui/HabitatScene';
import { LineIcon } from '../ui/LineIcon';
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
          <AppText variant="overline" color={colors.forest}>
            Animal do dia
          </AppText>
        </View>
        <AppText variant="title" numberOfLines={1} adjustsFontSizeToFit>
          {animal.name.ptBR}
        </AppText>
        {animal.content.preschool[0] ? (
          <AppText variant="caption" color={colors.ink} numberOfLines={2}>
            {animal.content.preschool[0]}
          </AppText>
        ) : null}
        <View style={styles.cta}>
          <View style={styles.play}>
            <LineIcon name="playFill" size={14} color={colors.terra} />
          </View>
          <AppText style={styles.ctaLabel}>Descobrir</AppText>
        </View>
      </View>
      <View style={styles.image}>
        <AnimalArt animalId={animal.id} size={138} />
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
  text: { flex: 1, gap: 6, alignItems: 'flex-start' },
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
  image: { alignItems: 'center', justifyContent: 'center' },
});
