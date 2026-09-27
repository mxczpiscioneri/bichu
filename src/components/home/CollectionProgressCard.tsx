import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

import { Mascot } from '../brand/Mascot';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { ProgressBar } from '../ui/ProgressBar';

interface CollectionProgressCardProps {
  title: string;
  discovered: number;
  total: number;
  /** Home links to the Bichupédia; inside the Bichupédia the card is static. */
  linkToCollection?: boolean;
}

export function CollectionProgressCard({
  title,
  discovered,
  total,
  linkToCollection = false,
}: CollectionProgressCardProps) {
  const percent = total > 0 ? Math.round((discovered / total) * 100) : 0;
  const content = (
    <>
      <View style={styles.text}>
        <AppText variant="subheading">{title}</AppText>
        <AppText variant="caption">
          {discovered} de {total} animais descobertos
        </AppText>
        <View style={styles.barRow}>
          <View style={styles.bar}>
            <ProgressBar value={discovered} max={total} />
          </View>
          <AppText variant="caption" color={colors.forest} style={styles.percent}>
            {percent}%
          </AppText>
        </View>
      </View>
      <Mascot pose={discovered > 0 ? 'hug' : 'explore'} height={96} animated={false} />
    </>
  );
  if (!linkToCollection) return <View style={styles.card}>{content}</View>;
  return (
    <PressableScale
      onPress={() => router.navigate('/collection')}
      accessibilityLabel={`${title}: ${discovered} de ${total} animais descobertos`}
      style={styles.card}
      pressedScale={0.98}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingLeft: spacing.md + 4,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm + 4,
    ...shadows.card,
  },
  text: { flex: 1, gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  bar: { flex: 1 },
  percent: { fontFamily: 'Nunito_800ExtraBold' },
});
