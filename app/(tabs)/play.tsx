import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MascotBubble } from '@/components/brand/MascotBubble';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { templatesForLevel } from '@/challenges/templates';
import type { ChallengeTemplateId } from '@/challenges/types';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useLevel } from '@/stores/settingsStore';
import { colors, radius, shadows, spacing, tones, type Tone } from '@/theme';

const TONE_BY_TEMPLATE: Record<ChallengeTemplateId, Tone> = {
  sound_to_animal: 'savanna',
  food: 'home',
  habitat: 'forest',
  locomotion: 'sky',
  body_covering: 'farm',
  reproduction: 'ocean',
  class: 'forest',
};

export default function PlayScreen() {
  const level = useLevel();
  const bottomInset = useTabBarInset();
  const templates = templatesForLevel(level);

  return (
    <Screen bottomInset={bottomInset}>
      <AppText variant="title">Brincar</AppText>
      <MascotBubble text="Escolha uma brincadeira!" />
      <View style={styles.list}>
        {templates.map((template, index) => {
          const tone = tones[TONE_BY_TEMPLATE[template.id]];
          const featured = index === 0;
          return (
            <PressableScale
              key={template.id}
              onPress={() => router.push({ pathname: '/challenge/[type]', params: { type: template.id } })}
              accessibilityLabel={template.title}
              accessibilityHint={template.subtitle}
              style={[styles.card, { backgroundColor: tone.background }, featured && styles.featured]}
              pressedScale={0.97}
            >
              <View style={[styles.iconWrap, featured && styles.iconWrapFeatured]}>
                <Icon name={template.icon} size={featured ? 64 : 48} />
              </View>
              <View style={styles.text}>
                <AppText variant={featured ? 'heading' : 'subheading'}>{template.title}</AppText>
                <AppText variant="caption" color={colors.cacao}>
                  {template.subtitle}
                </AppText>
              </View>
              <AppText style={[styles.arrow, { color: tone.accent }]}>›</AppText>
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
