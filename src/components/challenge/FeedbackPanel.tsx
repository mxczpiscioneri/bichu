import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, radius, shadows, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { BigButton } from '../ui/BigButton';
import { Icon } from '../ui/Icon';

interface FeedbackPanelProps {
  title: string;
  explanation: string;
  earnedStar: boolean;
  onContinue: () => void;
  continueLabel: string;
}

/** Positive feedback after a right answer: short phrase + one learning sentence. */
export function FeedbackPanel({ title, explanation, earnedStar, onContinue, continueLabel }: FeedbackPanelProps) {
  return (
    <Animated.View entering={FadeInDown.springify().damping(16)} style={styles.panel}>
      <View style={styles.row}>
        <Icon name={earnedStar ? 'star' : 'sparkles'} size={52} />
        <View style={styles.text}>
          <AppText variant="title" color={colors.forest}>
            {title}
          </AppText>
          <AppText variant="bodyStrong">{explanation}</AppText>
        </View>
      </View>
      <BigButton label={continueLabel} icon="footprints" onPress={onContinue} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg + 4,
    padding: spacing.md + 4,
    gap: spacing.md,
    ...shadows.raised,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
});
