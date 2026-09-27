import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

import { Mascot } from '../brand/Mascot';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

/** Contextual entry to the flagship game "Que animal é esse?". */
export function PlayShortcutCard() {
  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/challenge/[type]', params: { type: 'sound_to_animal' } })}
      accessibilityLabel="Brincar: Que animal é esse?"
      style={styles.card}
      pressedScale={0.97}>
      <View style={styles.text}>
        <AppText variant="overline" color={colors.white}>
          Vamos brincar?
        </AppText>
        <AppText variant="heading" color={colors.white}>
          Que som será esse?
        </AppText>
        <View style={styles.pill}>
          <Icon name="speaker" size={24} />
          <AppText variant="label" color={colors.forest}>
            Adivinhar
          </AppText>
        </View>
      </View>
      <Mascot pose="explore" height={120} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.forest,
    borderRadius: radius.lg,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.md,
    overflow: 'hidden',
    ...shadows.raised,
  },
  text: { flex: 1, gap: spacing.sm },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
});
