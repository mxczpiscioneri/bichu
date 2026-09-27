import { StyleSheet, View } from 'react-native';

import { CLASS_LABELS, DIET_LABELS, FOOD_LABELS, HABITAT_LABELS } from '@/content/labels';
import type { Animal } from '@/domain/animal';
import { spacing } from '@/theme';

import { Chip } from '../ui/Chip';

/** "Mamífero · Carnívoro · Savana" as icon chips. */
export function AnimalTraits({ animal }: { animal: Animal }) {
  const mainHabitat = animal.habitats.find((h) => h !== 'mixed') ?? animal.habitats[0];
  const dietIcon = animal.foods[0] ? FOOD_LABELS[animal.foods[0]].icon : 'banana';
  return (
    <View style={styles.row}>
      <Chip label={CLASS_LABELS[animal.taxonomy.class].label} icon={CLASS_LABELS[animal.taxonomy.class].icon} />
      <Chip label={DIET_LABELS[animal.diet]} icon={dietIcon} />
      <Chip label={HABITAT_LABELS[mainHabitat].label} icon={HABITAT_LABELS[mainHabitat].icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
