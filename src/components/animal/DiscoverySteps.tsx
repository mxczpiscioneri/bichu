import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/content/icons';
import { discoverySteps, type AnimalProgress } from '@/progress/progress';
import { colors, radius, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';

function Step({ done, icon, label }: { done: boolean; icon: IconName; label: string }) {
  return (
    <View style={[styles.step, done && styles.stepDone]} accessibilityLabel={`${label}: ${done ? 'feito' : 'falta'}`} accessible>
      <View style={[styles.iconWrap, done && styles.iconDone]}>
        <Icon name={done ? 'check' : icon} size={24} />
      </View>
      <AppText variant="caption" style={styles.label} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

/** What is left to discover this animal: name, sound, challenges. */
export function DiscoverySteps({ progress }: { progress: AnimalProgress | undefined }) {
  const steps = discoverySteps(progress);
  const challengesDone = steps.challenges >= steps.challengesNeeded;
  return (
    <View style={styles.row}>
      <Step done={steps.heardName} icon="speaker" label="Nome" />
      <Step done={steps.heardSound} icon="speaker" label="Som" />
      <Step done={challengesDone} icon="puzzle" label={`Desafios ${steps.challenges}/${steps.challengesNeeded}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  step: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.pill,
    padding: 5,
    paddingRight: spacing.sm,
  },
  stepDone: { backgroundColor: colors.surface },
  iconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cacaoSoft },
  iconDone: { backgroundColor: colors.leafSoft },
  label: { flexShrink: 1, fontFamily: 'Nunito_800ExtraBold', color: colors.ink },
});
