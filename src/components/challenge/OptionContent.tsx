import { StyleSheet, View } from 'react-native';

import type { ChallengeOption } from '@/challenges/types';

import { AnimalImage } from '../animal/AnimalImage';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

/** Picture first, short label below — readable without reading. */
export function OptionContent({ option, size }: { option: ChallengeOption; size: number }) {
  return (
    <View style={styles.content}>
      {option.animalId ? <AnimalImage animalId={option.animalId} size={size} /> : null}
      {option.icon ? <Icon name={option.icon} size={size} /> : null}
      <AppText variant="label" align="center" numberOfLines={2}>
        {option.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: 6 },
});
