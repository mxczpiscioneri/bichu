import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Mascot } from './Mascot';

interface MascotBubbleProps {
  text: string;
  /** Optional control beside the text (e.g. replay audio). */
  accessory?: ReactNode;
  size?: 'md' | 'lg';
}

/** Bichu "talking": avatar + speech bubble. Keep the text to one short sentence. */
export function MascotBubble({ text, accessory, size = 'md' }: MascotBubbleProps) {
  const avatar = size === 'lg' ? 72 : 60;
  return (
    <View style={styles.row}>
      <Mascot pose="avatar" height={avatar} animated={false} />
      <View style={styles.bubble}>
        <View style={styles.tail} />
        <AppText variant={size === 'lg' ? 'heading' : 'subheading'} style={styles.text} accessibilityRole="text">
          {text}
        </AppText>
        {accessory}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4 },
  bubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 6,
    paddingHorizontal: spacing.md,
    ...shadows.card,
  },
  tail: {
    position: 'absolute',
    left: -7,
    top: '50%',
    marginTop: -8,
    width: 16,
    height: 16,
    backgroundColor: colors.surface,
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  text: { flex: 1 },
});
