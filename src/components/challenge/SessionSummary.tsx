import { StyleSheet, View } from 'react-native';

import { getAnimal } from '@/content/animals';
import { phrase, PHRASES } from '@/content/phrases';
import { colors, radius, spacing } from '@/theme';

import { AnimalImage } from '../animal/AnimalImage';
import { Mascot } from '../brand/Mascot';
import { AppText } from '../ui/AppText';
import { BigButton } from '../ui/BigButton';
import { Icon } from '../ui/Icon';

interface SessionSummaryProps {
  rounds: number;
  starsEarned: number;
  discovered: string[];
  onAgain: () => void;
  onDone: () => void;
}

export function SessionSummary({ rounds, starsEarned, discovered, onAgain, onDone }: SessionSummaryProps) {
  return (
    <View style={styles.root}>
      <Mascot pose="cheer" height={200} />
      <AppText variant="title" align="center">
        {phrase(PHRASES.finished, rounds + starsEarned)}
      </AppText>
      <View style={styles.stars} accessibilityLabel={`${starsEarned} estrelas novas`} accessible>
        <Icon name="star" size={44} />
        <AppText variant="heading">
          {starsEarned > 0 ? `+${starsEarned} ${starsEarned === 1 ? 'estrela' : 'estrelas'}` : `${rounds} desafios`}
        </AppText>
      </View>
      {discovered.length > 0 ? (
        <View style={styles.discovered}>
          <AppText variant="subheading" align="center">
            Novos na Bichupédia:
          </AppText>
          <View style={styles.discoveredRow}>
            {discovered.map((id) => (
              <View key={id} style={styles.discoveredItem}>
                <AnimalImage animalId={id} size={72} />
                <AppText variant="label">{getAnimal(id)?.name.ptBR}</AppText>
              </View>
            ))}
          </View>
        </View>
      ) : null}
      <View style={styles.actions}>
        <BigButton label="Brincar de novo" icon="puzzle" variant="warm" onPress={onAgain} />
        <BigButton label="Voltar" icon="house" variant="light" onPress={onDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sunSoft,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  discovered: { gap: spacing.sm, alignItems: 'center' },
  discoveredRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  discoveredItem: { alignItems: 'center', gap: 4 },
  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.md },
});
