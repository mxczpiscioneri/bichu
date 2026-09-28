import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Mascot } from '@/components/brand/Mascot';
import { AppText } from '@/components/ui/AppText';
import { LineIcon } from '@/components/ui/LineIcon';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import type { MascotPose } from '@/content/media';
import type { Level } from '@/domain/animal';
import { useSettingsStore } from '@/stores/settingsStore';
import { colors, radius, shadows, spacing } from '@/theme';

const MODES: { level: Level; title: string; description: string; pose: MascotPose; background: string }[] = [
  {
    level: 'explorer',
    title: 'Explorador',
    description: 'Interações simples, com muito áudio e imagens.',
    pose: 'hug',
    background: colors.sunSoft,
  },
  {
    level: 'adventurer',
    title: 'Aventureiro',
    description: 'Mais desafios, curiosidades e informações.',
    pose: 'explore',
    background: '#FCD9A8',
  },
];

/** Same app, two difficulty levels. Opened from the parents area (Modo padrão). */
export default function ChooseLevelScreen() {
  const { level: current, setLevel, onboarded, completeOnboarding } = useSettingsStore();

  const choose = (level: Level) => {
    setLevel(level);
    if (!onboarded) {
      completeOnboarding();
      router.replace('/');
    } else {
      router.back();
    }
  };

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <AppText variant="title" align="center">
        Como você quer explorar hoje?
      </AppText>
      {MODES.map((mode) => (
        <PressableScale
          key={mode.level}
          onPress={() => choose(mode.level)}
          accessibilityRole="button"
          accessibilityState={{ selected: onboarded && current === mode.level }}
          accessibilityLabel={`Modo ${mode.title}. ${mode.description}`}
          style={[
            styles.card,
            { backgroundColor: mode.background },
            onboarded && current === mode.level && styles.selected,
          ]}
          pressedScale={0.97}>
          <Mascot pose={mode.pose} height={120} animated={false} />
          <View style={styles.text}>
            <AppText variant="caption" color={colors.cacao} style={styles.kicker}>
              Modo
            </AppText>
            <AppText variant="title" style={styles.title}>
              {mode.title}
            </AppText>
            <AppText variant="caption" color={colors.cacao}>
              {mode.description}
            </AppText>
          </View>
          <LineIcon name="arrowRight" size={26} color={colors.cacao} />
        </PressableScale>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xl, gap: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    padding: spacing.md,
    paddingRight: spacing.md + 4,
    minHeight: 180,
    borderWidth: 4,
    borderColor: 'transparent',
    ...shadows.card,
  },
  selected: { borderColor: colors.leaf },
  text: { flex: 1, gap: 2 },
  kicker: { fontFamily: 'Nunito_800ExtraBold' },
  title: { fontSize: 26, lineHeight: 32 },
});
