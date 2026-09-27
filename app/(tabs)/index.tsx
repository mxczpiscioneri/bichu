import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimalCard } from '@/components/animal/AnimalCard';
import { Logo } from '@/components/brand/Logo';
import { Mascot } from '@/components/brand/Mascot';
import { AnimalOfTheDayCard } from '@/components/home/AnimalOfTheDayCard';
import { CollectionProgressCard } from '@/components/home/CollectionProgressCard';
import { PlayShortcutCard } from '@/components/home/PlayShortcutCard';
import { AppText } from '@/components/ui/AppText';
import { RoundButton } from '@/components/ui/RoundButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { animals } from '@/content/animals';
import { animalsInCollection, BICHUPEDIA_COLLECTION_IDS, getCollection } from '@/content/collections';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { animalOfTheDay, countDiscovered, recentAnimals, suggestedAnimals, totalStars } from '@/progress/selectors';
import { useProgressStore } from '@/stores/progressStore';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const progress = useProgressStore((state) => state.byAnimal);
  const bottomInset = useTabBarInset();
  const featured = useMemo(() => animalOfTheDay(animals), []);

  const recent = recentAnimals(animals, progress);
  const row = recent.length > 0 ? recent : suggestedAnimals(animals, progress, [featured.id]);
  const discovered = countDiscovered(animals, progress);

  // Highlight the collection closest to completion (but not complete).
  const highlight = BICHUPEDIA_COLLECTION_IDS.map((id) => {
    const members = animalsInCollection(animals, id);
    return { label: getCollection(id).label, discovered: countDiscovered(members, progress), total: members.length };
  })
    .filter((c) => c.discovered < c.total)
    .sort((a, b) => b.discovered / b.total - a.discovered / a.total)[0];

  return (
    <Screen bottomInset={bottomInset}>
      <View style={styles.header}>
        <Mascot pose="avatar" height={60} animated={false} />
        <View style={styles.greeting}>
          <Logo width={96} withTagline={false} />
          <AppText variant="subheading" color={colors.cacao}>
            Vamos descobrir?
          </AppText>
        </View>
        <RoundButton
          glyph="⋯"
          size={44}
          accessibilityLabel="Área dos adultos"
          onPress={() => router.push('/parents')}
          background={colors.cacaoSoft}
        />
      </View>

      <AnimalOfTheDayCard animal={featured} />

      <View style={styles.section}>
        <SectionHeader title={recent.length > 0 ? 'Continue explorando' : 'Comece por aqui'} icon="footprints" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {row.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} size="sm" width={132} />
          ))}
        </ScrollView>
      </View>

      <PlayShortcutCard />

      <View style={styles.section}>
        <SectionHeader title="Sua Bichupédia" icon="books" />
        <CollectionProgressCard
          discovered={discovered}
          total={animals.length}
          stars={totalStars(progress)}
          highlight={highlight}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4 },
  greeting: { flex: 1, gap: 2 },
  section: { gap: spacing.sm + 4 },
  carousel: { gap: spacing.sm + 4, paddingVertical: spacing.sm, paddingHorizontal: 2 },
});
