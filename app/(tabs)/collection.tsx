import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AnimalCard } from '@/components/animal/AnimalCard';
import { Mascot } from '@/components/brand/Mascot';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { animals } from '@/content/animals';
import { animalsInCollection, BICHUPEDIA_COLLECTION_IDS, getCollection } from '@/content/collections';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { countDiscovered, totalStars } from '@/progress/selectors';
import { useProgressStore } from '@/stores/progressStore';
import { colors, radius, spacing, tones } from '@/theme';

const MEMBER_GAP = spacing.sm + 2;

export default function CollectionScreen() {
  const progress = useProgressStore((state) => state.byAnimal);
  const bottomInset = useTabBarInset();
  const discovered = countDiscovered(animals, progress);
  const stars = totalStars(progress);
  const { width } = useWindowDimensions();
  // Three cards per row inside the collection panel.
  const cardWidth = Math.floor((Math.min(width, 600) - (spacing.lg - 4) * 2 - spacing.md * 2 - MEMBER_GAP * 2) / 3);

  return (
    <Screen bottomInset={bottomInset}>
      <AppText variant="title">Bichupédia</AppText>

      <Card style={styles.summary}>
        <Mascot pose={discovered > 0 ? 'hug' : 'explore'} height={112} />
        <View style={styles.summaryText}>
          <AppText variant="heading">
            {discovered} / {animals.length}
          </AppText>
          <AppText variant="body">{discovered === 0 ? 'Descubra seu primeiro animal!' : 'animais descobertos'}</AppText>
          <View style={styles.stars}>
            <Icon name="star" size={24} />
            <AppText variant="label">
              {stars} {stars === 1 ? 'estrela' : 'estrelas'}
            </AppText>
          </View>
        </View>
      </Card>

      {BICHUPEDIA_COLLECTION_IDS.map((id) => {
        const collection = getCollection(id);
        const members = animalsInCollection(animals, id);
        const found = countDiscovered(members, progress);
        const tone = tones[collection.tone];
        return (
          <View key={id} style={[styles.collection, { backgroundColor: tone.background }]}>
            <View style={styles.collectionHeader}>
              <Icon name={collection.icon} size={40} />
              <AppText variant="heading" style={styles.collectionTitle}>
                {collection.label}
              </AppText>
              <AppText variant="subheading" color={tone.accent} accessibilityLabel={`${found} de ${members.length}`}>
                {found} / {members.length}
              </AppText>
            </View>
            <ProgressBar value={found} max={members.length} color={tone.accent} track="rgba(255,255,255,0.8)" />
            <View style={styles.members}>
              {members.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} size="sm" width={cardWidth} veiled />
              ))}
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryText: { flex: 1, gap: 2 },
  stars: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.sunSoft,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 4,
  },
  collection: { borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  collectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  collectionTitle: { flex: 1 },
  members: { flexDirection: 'row', flexWrap: 'wrap', gap: MEMBER_GAP },
});
