import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { track } from '@/analytics';
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

const PRIVACY_URL = 'https://bichu-app.vercel.app/privacidade.html';

const LEVEL_NAMES = { explorer: 'Explorador', adventurer: 'Aventureiro' } as const;

export default function ParentsScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { level, soundEnabled, setSoundEnabled, analyticsEnabled, setAnalytics } = useSettingsStore();
  const { byAnimal, reset } = useProgressStore();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <AppText variant="title">Área dos pais</AppText>
        <RoundButton icon="close" size={48} accessibilityLabel="Fechar" onPress={() => router.back()} />
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
              onPress={() => {
                track('button_click', { button: 'parents_choose_mode' });
                router.push('/choose-level');
              }}
            />
            <SettingsRow icon="speaker" label="Som" toggle={{ value: soundEnabled, onChange: setSoundEnabled }} />
            <SettingsRow
              icon="lock"
              label="Estatísticas anônimas de uso"
              value={analyticsEnabled ? 'Ligado' : 'Desligado'}
              toggle={{ value: analyticsEnabled, onChange: setAnalytics }}
              details={
                <AppText variant="caption">
                  Contamos de forma anônima (Google Analytics) quantas pessoas usam o Bichu e quais brincadeiras são
                  iniciadas e concluídas, para melhorar o app. Sem nome, conta, localização precisa, ID de publicidade
                  ou rastreamento. Ao desligar, o aparelho para de enviar essas contagens.
                </AppText>
              }
            />
            <SettingsRow
              icon="cube"
              label="AR experimental"
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
                <>
                  <AppText variant="caption">
                    Sem login, chat, anúncios ou rastreamento. O progresso fica salvo só neste aparelho. Contamos de
                    forma anônima (Google Analytics) quantas pessoas usam o app e as brincadeiras jogadas, sem nome,
                    conta, localização precisa, ID de publicidade ou rastreamento; dá para desligar em
                    &quot;Estatísticas anônimas de uso&quot;. A câmera só é usada na realidade aumentada, para mostrar o
                    animal no ambiente; nenhuma imagem é salva ou enviada. O app não usa microfone, localização,
                    contatos nem fotos.
                  </AppText>
                  <AppText
                    variant="caption"
                    color={colors.forest}
                    accessibilityRole="link"
                    onPress={() => {
                      track('button_click', { button: 'parents_privacy_policy' });
                      void Linking.openURL(PRIVACY_URL);
                    }}>
                    Ler a política de privacidade completa
                  </AppText>
                </>
              }
            />
            <SettingsRow
              icon="heart"
              label="Créditos"
              onPress={() => {
                track('button_click', { button: 'parents_credits' });
                router.push('/credits');
              }}
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
                    track('button_click', { button: 'parents_reset_progress' });
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
