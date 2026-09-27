import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ParentGate } from '@/components/parents/ParentGate';
import { SettingsRow } from '@/components/parents/SettingsRow';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { PressableScale } from '@/components/ui/PressableScale';
import { RoundButton } from '@/components/ui/RoundButton';
import { Screen } from '@/components/ui/Screen';
import { isArBuild } from '@/ar/availability';
import { animals, CONTENT_STATUS } from '@/content/animals';
import { countDiscovered } from '@/progress/selectors';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { colors, radius, spacing } from '@/theme';

const LEVEL_NAMES = { explorer: 'Explorador', adventurer: 'Aventureiro' } as const;

export default function ParentsScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { level, soundEnabled, setSoundEnabled } = useSettingsStore();
  const { byAnimal, reset } = useProgressStore();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <AppText variant="title">Área dos pais</AppText>
        <RoundButton
          icon="close"
          size={48}
          iconColor={colors.ink}
          accessibilityLabel="Fechar"
          onPress={() => router.back()}
        />
      </View>

      {!unlocked ? (
        <Card>
          <ParentGate onUnlock={() => setUnlocked(true)} />
        </Card>
      ) : (
        <>
          <Card style={styles.list}>
            <SettingsRow icon="globe" label="Idioma" value="Português (Brasil)" />
            <SettingsRow
              icon="mascot"
              label="Modo padrão"
              value={LEVEL_NAMES[level]}
              onPress={() => router.push('/choose-level')}
            />
            <SettingsRow icon="speaker" label="Som" toggle={{ value: soundEnabled, onChange: setSoundEnabled }} />
            <SettingsRow
              icon="cube"
              label="AR (experimental)"
              value={isArBuild() ? 'Neste build' : 'Indisponível'}
              details={
                <AppText variant="caption">
                  A realidade aumentada é um teste e só aparece em builds nativos com AR habilitada e para animais com
                  modelo 3D. A câmera é usada só para mostrar o animal; nenhuma imagem é salva ou enviada.
                </AppText>
              }
            />
            <SettingsRow
              icon="info"
              label="Sobre o Bichu"
              details={
                <AppText variant="caption">
                  Bichu — Descubra o mundo animal. A criança conhece cada animal pela imagem, pelo nome falado com as
                  sílabas e pelo som real, e completa desafios para montar a sua Bichupédia. Status do conteúdo:{' '}
                  {CONTENT_STATUS}; os fatos ainda passarão por revisão especializada.
                </AppText>
              }
            />
            <SettingsRow
              icon="shield"
              label="Privacidade"
              details={
                <AppText variant="caption">
                  Sem conta, sem anúncios e sem rastreamento. O progresso fica salvo só neste aparelho e nenhum dado é
                  enviado para servidores. O app não usa microfone, localização, contatos nem fotos.
                </AppText>
              }
            />
            <SettingsRow
              icon="heart"
              label="Créditos"
              details={
                <AppText variant="caption">
                  Ilustrações, sons e locuções: acervo do Zoo Babies / AnimalSounds. Ícones: Microsoft Fluent Emoji
                  (licença MIT). Mascote Bichu — Guardião da Floresta.
                </AppText>
              }
            />
          </Card>

          <Card style={styles.section}>
            <AppText variant="subheading">Progresso</AppText>
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
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { paddingVertical: spacing.xs },
  section: { gap: spacing.md },
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
