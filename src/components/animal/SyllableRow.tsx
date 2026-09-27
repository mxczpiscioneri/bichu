import { StyleSheet, View } from 'react-native';

import { useNowPlaying } from '@/audio/AudioService';
import { colors, fonts, radius, spacing } from '@/theme';

import { AppText } from '../ui/AppText';

/** "E · le · fan · te" — lights up while the name recording plays. */
export function SyllableRow({ syllables, clipKey }: { syllables: string[]; clipKey: string }) {
  const playing = useNowPlaying((state) => state.key === clipKey);
  return (
    <View style={styles.row} accessibilityLabel={`Sílabas: ${syllables.join('-')}`} accessible>
      {syllables.map((syllable, index) => (
        <View key={`${syllable}-${index}`} style={[styles.pill, playing && styles.pillActive]}>
          <AppText style={[styles.text, playing && styles.textActive]}>{syllable.toLocaleLowerCase('pt-BR')}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  pill: {
    minWidth: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
  },
  pillActive: { backgroundColor: colors.sun },
  text: { fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 28, color: colors.cacao },
  textActive: { color: colors.ink },
});
