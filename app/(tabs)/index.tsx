import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimalTile } from '@/components/animal/AnimalTile';
import { Mascot } from '@/components/brand/Mascot';
import { AnimalOfTheDayCard } from '@/components/home/AnimalOfTheDayCard';
import { CollectionProgressCard } from '@/components/home/CollectionProgressCard';
import { HomeRow } from '@/components/home/HomeRow';
import { PlaceShortcuts, PlayShortcuts } from '@/components/home/HomeShortcuts';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { SettingsButton } from '@/components/ui/ScreenHeader';
import { templatesForLevel } from '@/challenges/templates';
import { animals } from '@/content/animals';
import { useLayout } from '@/hooks/useLayout';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { animalOfTheDay, countDiscovered, recentAnimals, suggestedAnimals } from '@/progress/selectors';
import { useProgressStore } from '@/stores/progressStore';
import { useLevel } from '@/stores/settingsStore';
import { spacing } from '@/theme';

export default function HomeScreen() {
  const progress = useProgressStore((state) => state.byAnimal);
  const bottomInset = useTabBarInset();
  const level = useLevel();
  const { isTablet, contentWidth } = useLayout();
  const featured = useMemo(() => animalOfTheDay(animals), []);

  const recent = recentAnimals(animals, progress);
  // Recent animals first, topped up with suggestions so the row never looks empty.
  const suggestions = suggestedAnimals(animals, progress, [featured.id, ...recent.map((a) => a.id)]);
  // Tablets show one full-width row of bigger tiles; phones scroll through more.
  const rowCount = isTablet ? 6 : 8;
  const row = [...recent, ...suggestions].slice(0, rowCount);
  const tileWidth = isTablet ? Math.floor((contentWidth - 14 * (rowCount - 1)) / rowCount) : 112;

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

      <HomeRow title={recent.length > 0 ? 'Continue explorando' : 'Comece por aqui'} gap={14}>
        {row.map((animal) => (
          <AnimalTile key={animal.id} animal={animal} width={tileWidth} />
        ))}
      </HomeRow>

      <PlayShortcuts templates={templatesForLevel(level)} />

      <CollectionProgressCard
        title="Sua Bichupédia"
        discovered={countDiscovered(animals, progress)}
        total={animals.length}
        linkToCollection
      />

      <PlaceShortcuts />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2 },
  greeting: { flex: 1 },
});
