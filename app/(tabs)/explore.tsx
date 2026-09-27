import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimalGrid } from '@/components/animal/AnimalGrid';
import { MascotBubble } from '@/components/brand/MascotBubble';
import { AppText } from '@/components/ui/AppText';
import { FilterChips, type FilterOption } from '@/components/ui/FilterChips';
import { Screen } from '@/components/ui/Screen';
import { animals } from '@/content/animals';
import { animalsInCollection, EXPLORE_FILTER_IDS, getCollection } from '@/content/collections';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { spacing } from '@/theme';

const ALL = 'all';
const FILTERS: FilterOption[] = [
  { id: ALL, label: 'Todos', icon: 'paws' },
  ...EXPLORE_FILTER_IDS.map((id) => {
    const collection = getCollection(id);
    return { id, label: collection.label, icon: collection.icon };
  }),
];

export default function ExploreScreen() {
  const [filter, setFilter] = useState<string>(ALL);
  const bottomInset = useTabBarInset();
  const visible = filter === ALL ? animals : animalsInCollection(animals, filter);

  return (
    <Screen bottomInset={bottomInset}>
      <View style={styles.header}>
        <AppText variant="title">Explorar</AppText>
        <MascotBubble text="Toque em um animal para conhecer!" />
      </View>
      <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
      <AppText variant="caption">
        {visible.length} {visible.length === 1 ? 'animal' : 'animais'}
      </AppText>
      <AnimalGrid animals={visible} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md },
});
