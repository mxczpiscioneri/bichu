import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimalTile } from '@/components/animal/AnimalTile';
import { Mascot } from '@/components/brand/Mascot';
import { AnimalOfTheDayCard } from '@/components/home/AnimalOfTheDayCard';
import { CollectionProgressCard } from '@/components/home/CollectionProgressCard';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { SettingsButton } from '@/components/ui/ScreenHeader';
import { animals } from '@/content/animals';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { animalOfTheDay, countDiscovered, recentAnimals, suggestedAnimals } from '@/progress/selectors';
import { useProgressStore } from '@/stores/progressStore';
import { spacing } from '@/theme';

export default function HomeScreen() {
  const progress = useProgressStore((state) => state.byAnimal);
  const bottomInset = useTabBarInset();
  const featured = useMemo(() => animalOfTheDay(animals), []);

  const recent = recentAnimals(animals, progress);
  // Recent animals first, topped up with suggestions so the row never looks empty.
  const suggestions = suggestedAnimals(animals, progress, [featured.id, ...recent.map((a) => a.id)]);
  const row = [...recent, ...suggestions].slice(0, 8);

  return (
    <Screen bottomInset={bottomInset}>
      <View style={styles.header}>
        <Mascot pose="avatar" height={48} animated={false} />
        <AppText variant="subheading" style={styles.greeting}>
          Olá, pequeno explorador!
        </AppText>
        <SettingsButton />
      </View>

      <AnimalOfTheDayCard animal={featured} />

      <View style={styles.section}>
        <AppText variant="subheading" accessibilityRole="header">
          {recent.length > 0 ? 'Continue explorando' : 'Comece por aqui'}
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carouselScroller}
          contentContainerStyle={styles.carousel}>
          {row.map((animal) => (
            <AnimalTile key={animal.id} animal={animal} width={112} />
          ))}
        </ScrollView>
      </View>

      <CollectionProgressCard
        title="Sua Bichupédia"
        discovered={countDiscovered(animals, progress)}
        total={animals.length}
        linkToCollection
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  greeting: { flex: 1 },
  section: { gap: spacing.sm },
  carouselScroller: { marginHorizontal: -(spacing.lg - 4) },
  carousel: { gap: spacing.sm + 4, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg - 4 },
});
