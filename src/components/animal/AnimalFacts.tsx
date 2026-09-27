import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SIZE_LABELS } from '@/content/labels';
import type { Animal, Level } from '@/domain/animal';
import { colors, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { SegmentedTabs } from '../ui/SegmentedTabs';

type Tab = 'about' | 'curiosities';

/** "Sobre" follows the level (short sentences for Explorers); "Curiosidades" is optional extra. */
export function AnimalFacts({ animal, level }: { animal: Animal; level: Level }) {
  const [tab, setTab] = useState<Tab>('about');
  const about = level === 'explorer' ? animal.content.preschool : animal.content.kids;
  const curiosities = animal.content.curiosities;
  const tabs: { id: Tab; label: string }[] = [{ id: 'about', label: 'Sobre' }];
  if (curiosities.length > 0) tabs.push({ id: 'curiosities', label: 'Curiosidades' });
  const facts = tab === 'about' ? about : curiosities;

  return (
    <View style={styles.section}>
      <SegmentedTabs tabs={tabs} selected={tab} onSelect={setTab} />
      <View style={styles.list}>
        {facts.map((fact) => (
          <View key={fact} style={styles.fact}>
            <Icon name={tab === 'about' ? 'leaves' : 'sparkles'} size={24} />
            <AppText variant="body" style={styles.factText}>
              {fact}
            </AppText>
          </View>
        ))}
      </View>
      {tab === 'about' ? (
        <View style={styles.size}>
          <Icon name="footprints" size={22} />
          <AppText variant="caption" color={colors.ink}>
            Tamanho: {SIZE_LABELS[animal.sizeClass]}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  list: { gap: spacing.sm + 2 },
  fact: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm + 2 },
  factText: { flex: 1 },
  size: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
