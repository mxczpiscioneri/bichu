import { useState } from 'react';

import { TileGrid } from '@/components/animal/TileGrid';
import { CollectionProgressCard } from '@/components/home/CollectionProgressCard';
import { FilterChips, type FilterOption } from '@/components/ui/FilterChips';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { animals } from '@/content/animals';
import { animalsInCollection, BICHUPEDIA_COLLECTION_IDS, getCollection } from '@/content/collections';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { countDiscovered } from '@/progress/selectors';
import { useProgressStore } from '@/stores/progressStore';

const ALL = 'all';

export default function CollectionScreen() {
  const progress = useProgressStore((state) => state.byAnimal);
  const bottomInset = useTabBarInset();
  const [filter, setFilter] = useState<string>(ALL);

  // Each collection pill shows its own progress, e.g. "Fazenda 3/11".
  const filters: FilterOption[] = [
    { id: ALL, label: 'Todos' },
    ...BICHUPEDIA_COLLECTION_IDS.map((id) => {
      const members = animalsInCollection(animals, id);
      return { id, label: getCollection(id).label, count: `${countDiscovered(members, progress)}/${members.length}` };
    }),
  ];
  const visible = filter === ALL ? animals : animalsInCollection(animals, filter);

  return (
    <Screen bottomInset={bottomInset}>
      <ScreenHeader title="Bichupédia" subtitle="Todos os animais que você já descobriu." />
      <CollectionProgressCard
        title="Seu progresso"
        discovered={countDiscovered(animals, progress)}
        total={animals.length}
      />
      <FilterChips options={filters} selected={filter} onSelect={setFilter} />
      <TileGrid animals={visible} columns={3} lockUndiscovered />
    </Screen>
  );
}
