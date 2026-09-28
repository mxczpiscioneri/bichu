import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TONE_BY_TEMPLATE } from '@/components/challenge/templateTone';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { templatesForLevel } from '@/challenges/templates';
import { useLayout } from '@/hooks/useLayout';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useLevel } from '@/stores/settingsStore';
import { colors, radius, shadows, spacing, tones } from '@/theme';

export default function PlayScreen() {
  const level = useLevel();
  const bottomInset = useTabBarInset();
  const templates = templatesForLevel(level);
  // Tablets: a two-column grid of tall cards instead of a thin list.
  const { isTablet, contentWidth } = useLayout();
  const cardWidth = Math.floor((contentWidth - spacing.lg) / 2);

  return (
    <Screen bottomInset={bottomInset}>
      <ScreenHeader title="Brincar" subtitle="Escolha uma brincadeira!" />
      <View style={[styles.list, isTablet && styles.grid]}>
        {templates.map((template, index) => {
          const tone = tones[TONE_BY_TEMPLATE[template.id]];
          const featured = index === 0 && !isTablet;
          return (
            <PressableScale
              key={template.id}
              onPress={() => router.push({ pathname: '/challenge/[type]', params: { type: template.id } })}
              accessibilityLabel={template.title}
              accessibilityHint={template.subtitle}
              style={[
                styles.card,
                { backgroundColor: tone.background },
                featured && styles.featured,
                isTablet && [styles.cardTablet, { width: cardWidth }],
              ]}
              pressedScale={0.97}>
              <View
                style={[
                  styles.iconWrap,
                  (featured || isTablet) && styles.iconWrapFeatured,
                  isTablet && styles.iconWrapTablet,
                ]}>
                <Icon name={template.icon} size={isTablet ? 96 : featured ? 64 : 48} />
              </View>
              <View style={[styles.text, isTablet && styles.textTablet]}>
                <AppText
                  variant={featured || isTablet ? 'heading' : 'subheading'}
                  align={isTablet ? 'center' : undefined}>
                  {template.title}
                </AppText>
                <AppText
                  variant={isTablet ? 'body' : 'caption'}
                  color={colors.cacao}
                  align={isTablet ? 'center' : undefined}>
                  {template.subtitle}
                </AppText>
              </View>
              {isTablet ? null : <AppText style={[styles.arrow, { color: tone.accent }]}>›</AppText>}
            </PressableScale>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 96,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.card,
  },
  featured: { minHeight: 128 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  cardTablet: {
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 340,
    padding: spacing.lg,
    gap: spacing.md,
  },
  iconWrapTablet: { width: 150, height: 150, borderRadius: 75 },
  textTablet: { flex: 0, alignItems: 'center', gap: spacing.xs },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  iconWrapFeatured: { width: 92, height: 92, borderRadius: 46 },
  text: { flex: 1, gap: 2 },
  arrow: { fontFamily: 'Fredoka_700Bold', fontSize: 40, lineHeight: 44 },
});
