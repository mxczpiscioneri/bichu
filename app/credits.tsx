import { router } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { RoundButton } from '@/components/ui/RoundButton';
import { Screen } from '@/components/ui/Screen';
import { licenseLabel, modelCredits, OTHER_CREDITS } from '@/content/credits';
import { colors, spacing } from '@/theme';

/** Opened from the parents area (already behind the adult gate), so external links are allowed here. */
export default function CreditsScreen() {
  const groups = modelCredits();
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <AppText variant="title" accessibilityRole="header">
          Créditos
        </AppText>
        <RoundButton icon="close" size={48} accessibilityLabel="Fechar" onPress={() => router.back()} />
      </View>

      <Card style={styles.card}>
        <AppText variant="heading">Modelos 3D</AppText>
        <AppText variant="caption">
          Usados na realidade aumentada. Convertidos para GLB, reorientados, redimensionados para a escala real e com
          texturas reduzidas.
        </AppText>
        {groups.map((group) => (
          <View key={`${group.author}-${group.license}`} style={styles.group}>
            <AppText variant="bodyStrong">{group.author}</AppText>
            <AppText
              variant="caption"
              color={colors.forest}
              accessibilityRole="link"
              onPress={() => void Linking.openURL(group.licenseUrl)}>
              Licença {licenseLabel(group.license)}
            </AppText>
            <AppText variant="body">{group.items.map((item) => item.name).join(', ')}.</AppText>
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        {OTHER_CREDITS.map((credit) => (
          <View key={credit.title} style={styles.group}>
            <AppText variant="bodyStrong">{credit.title}</AppText>
            <AppText variant="body">{credit.text}</AppText>
          </View>
        ))}
      </Card>

      <AppText
        variant="caption"
        align="center"
        color={colors.forest}
        accessibilityRole="link"
        onPress={() => void Linking.openURL('https://bichu-app.vercel.app/creditos.html')}>
        Créditos completos, com links das fontes: bichu-app.vercel.app/creditos
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { gap: spacing.sm },
  group: { gap: 2, paddingTop: spacing.sm },
});
