import { StyleSheet, View } from 'react-native';

import { BODY_COVERING_LABELS, DIET_LABELS, FOOD_LABELS, HABITAT_LABELS } from '@/content/labels';
import type { Animal } from '@/domain/animal';
import { colors, radius, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

function Trait({ label, icon }: { label: string; icon: Parameters<typeof Icon>[0]['name'] }) {
  return (
    <View style={styles.chip} accessibilityLabel={label} accessible>
      <Icon name={icon} size={24} />
      <AppText variant="caption" color={colors.ink} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

/** "Carnívoro · Savana · Pelos" as small icon chips. */
export function AnimalTraits({ animal }: { animal: Animal }) {
  const habitat = animal.habitats.find((h) => h !== 'mixed') ?? animal.habitats[0];
  const dietIcon = animal.foods[0] ? FOOD_LABELS[animal.foods[0]].icon : 'banana';
  const covering = BODY_COVERING_LABELS[animal.bodyCovering];
  return (
    <View style={styles.row}>
      <Trait label={DIET_LABELS[animal.diet]} icon={dietIcon} />
      <Trait label={HABITAT_LABELS[habitat].label} icon={HABITAT_LABELS[habitat].icon} />
      <Trait label={covering.label} icon={covering.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: spacing.sm + 4,
    borderRadius: radius.pill,
    backgroundColor: colors.leafSoft,
  },
  text: { fontFamily: 'Nunito_800ExtraBold' },
});
