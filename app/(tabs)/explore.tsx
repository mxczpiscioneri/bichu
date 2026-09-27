import { useState } from 'react';

import { TileGrid } from '@/components/animal/TileGrid';
import { AppText } from '@/components/ui/AppText';
import { FilterChips, type FilterOption } from '@/components/ui/FilterChips';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { animals } from '@/content/animals';
import { animalsInCollection, EXPLORE_FILTER_IDS, getCollection } from '@/content/collections';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { matchesSearch } from '@/utils/search';

const ALL = 'all';
const FILTERS: FilterOption[] = [
  { id: ALL, label: 'Todos' },
  ...EXPLORE_FILTER_IDS.map((id) => ({ id, label: getCollection(id).label })),
];

export default function ExploreScreen() {
  const [filter, setFilter] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const bottomInset = useTabBarInset();
  const base = filter === ALL ? animals : animalsInCollection(animals, filter);
  const visible = base.filter((animal) => matchesSearch(animal.name.ptBR, query));

  return (
    <Screen bottomInset={bottomInset}>
      <ScreenHeader title="Explorar" subtitle="Conheça todos os animais e descubra suas histórias." />
      <SearchField value={query} onChange={setQuery} placeholder="Buscar animal…" />
      <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
      {visible.length > 0 ? (
        <TileGrid animals={visible} columns={2} />
      ) : (
        <AppText variant="body" align="center">
          Nenhum animal com esse nome. Vamos tentar outro?
        </AppText>
      )}
    </Screen>
  );
}
