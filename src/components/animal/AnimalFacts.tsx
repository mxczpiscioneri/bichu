import { StyleSheet, View } from 'react-native';

import type { Animal, Level } from '@/domain/animal';
import { withArticle } from '@/domain/language';
import { spacing } from '@/theme';

import { SectionHeader } from '../ui/SectionHeader';
import { FactCard } from './FactCard';

/** Explorer: one-idea sentences. Adventurer: explanations + curiosities. */
export function AnimalFacts({ animal, level }: { animal: Animal; level: Level }) {
  const facts = level === 'explorer' ? animal.content.preschool : animal.content.kids;
  const curiosities = level === 'adventurer' ? animal.content.curiosities : [];
  if (facts.length === 0 && curiosities.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={`Conheça ${withArticle(animal)}`} icon="magnifier" />
      {facts.map((fact) => (
        <FactCard key={fact} text={fact} />
      ))}
      {curiosities.map((fact) => (
        <FactCard key={fact} text={fact} icon="sparkles" highlight />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm + 4 },
});
