import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';
import { ProgressBar } from '../ui/ProgressBar';

interface CollectionProgressCardProps {
  discovered: number;
  total: number;
  stars: number;
  highlight?: { label: string; discovered: number; total: number };
}

export function CollectionProgressCard({ discovered, total, stars, highlight }: CollectionProgressCardProps) {
  return (
    <PressableScale
      onPress={() => router.navigate('/collection')}
      accessibilityLabel={`Bichupédia: ${discovered} de ${total} animais descobertos`}
      style={styles.card}
      pressedScale={0.97}
    >
      <View style={styles.header}>
        <Icon name="books" size={52} />
        <View style={styles.headerText}>
          <AppText variant="subheading">
            {discovered} de {total} animais
          </AppText>
          <AppText variant="caption">descobertos até agora</AppText>
        </View>
        <View style={styles.stars}>
          <Icon name="star" size={24} />
          <AppText variant="label">{stars}</AppText>
        </View>
      </View>
      <ProgressBar value={discovered} max={total} />
      {highlight ? (
        <View style={styles.highlight}>
          <AppText variant="label" style={styles.highlightLabel}>
            {highlight.label}
          </AppText>
          <AppText variant="label" color={colors.forest}>
            {highlight.discovered} / {highlight.total}
          </AppText>
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md + 4,
    gap: spacing.md,
    ...shadows.card,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1 },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.sunSoft,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 4,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.leafSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  highlightLabel: { flex: 1 },
});
