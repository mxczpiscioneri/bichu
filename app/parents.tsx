import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ParentGate } from '@/components/parents/ParentGate';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { PressableScale } from '@/components/ui/PressableScale';
import { RoundButton } from '@/components/ui/RoundButton';
import { Screen } from '@/components/ui/Screen';
import { animals, CONTENT_STATUS } from '@/content/animals';
import type { Level } from '@/domain/animal';
import { countDiscovered } from '@/progress/selectors';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { colors, radius, spacing } from '@/theme';

const LEVEL_OPTIONS: { level: Level; title: string; description: string }[] = [
  {
    level: 'explorer',
    title: 'Explorador',
    description: 'Cerca de 2 a 4 anos. Áudio primeiro, pouco texto, 2 alternativas.',
  },
  {
    level: 'adventurer',
    title: 'Aventureiro',
    description: 'Cerca de 5 a 8 anos. Mais informações, curiosidades e 3 alternativas.',
  },
];

export default function ParentsScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { level, setLevel } = useSettingsStore();
  const { byAnimal, reset } = useProgressStore();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <AppText variant="title">Para adultos</AppText>
        <RoundButton glyph="×" accessibilityLabel="Fechar" onPress={() => router.back()} />
      </View>

      {!unlocked ? (
        <Card>
          <ParentGate onUnlock={() => setUnlocked(true)} />
        </Card>
      ) : (
        <>
          <Card style={styles.section}>
            <AppText variant="heading">Nível</AppText>
            {LEVEL_OPTIONS.map((option) => {
              const active = option.level === level;
              return (
                <PressableScale
                  key={option.level}
                  onPress={() => setLevel(option.level)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  style={[styles.option, active && styles.optionActive]}>
                  <View style={[styles.radio, active && styles.radioActive]} />
                  <View style={styles.optionText}>
                    <AppText variant="subheading">{option.title}</AppText>
                    <AppText variant="caption">{option.description}</AppText>
                  </View>
                </PressableScale>
              );
            })}
          </Card>

          <Card style={styles.section}>
            <AppText variant="heading">Progresso</AppText>
            <AppText variant="body">
              {countDiscovered(animals, byAnimal)} de {animals.length} animais descobertos neste aparelho.
            </AppText>
            {confirmReset ? (
              <View style={styles.resetRow}>
                <PressableScale onPress={() => setConfirmReset(false)} style={[styles.smallButton, styles.cancel]}>
                  <AppText variant="label">Cancelar</AppText>
                </PressableScale>
                <PressableScale
                  onPress={() => {
                    reset();
                    setConfirmReset(false);
                  }}
                  style={[styles.smallButton, styles.danger]}>
                  <AppText variant="label" color={colors.white}>
                    Apagar tudo
                  </AppText>
                </PressableScale>
              </View>
            ) : (
              <PressableScale onPress={() => setConfirmReset(true)} style={[styles.smallButton, styles.cancel]}>
                <AppText variant="label">Apagar progresso…</AppText>
              </PressableScale>
            )}
          </Card>

          <Card style={styles.section}>
            <AppText variant="heading">Privacidade</AppText>
            <AppText variant="body">
              O Bichu não tem conta, anúncios nem rastreamento. O progresso fica salvo só neste aparelho. Nenhum dado é
              enviado para servidores.
            </AppText>
            <AppText variant="body">
              A câmera só é usada na realidade aumentada (experimental), para mostrar o animal no ambiente. Nenhuma
              imagem é salva.
            </AppText>
          </Card>

          <Card style={styles.section}>
            <AppText variant="heading">Sobre o conteúdo</AppText>
            <AppText variant="caption">
              Status do conteúdo: {CONTENT_STATUS}. Os fatos zoológicos ainda passarão por revisão especializada.
            </AppText>
            <AppText variant="caption">
              Ícones: Microsoft Fluent Emoji (MIT). Ilustrações, sons e locuções: acervo do Zoo Babies / AnimalSounds.
            </AppText>
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  optionActive: { borderColor: colors.leaf, backgroundColor: colors.leafSoft },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 3, borderColor: colors.inkSoft },
  radioActive: { borderColor: colors.forest, backgroundColor: colors.forest },
  optionText: { flex: 1, gap: 2 },
  resetRow: { flexDirection: 'row', gap: spacing.sm },
  smallButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  cancel: { backgroundColor: colors.cacaoSoft },
  danger: { backgroundColor: colors.flame },
});
