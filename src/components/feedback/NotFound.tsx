import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { Mascot } from '../brand/Mascot';
import { AppText } from '../ui/AppText';
import { BigButton } from '../ui/BigButton';

/** Friendly empty/error state — never a blank screen. */
export function NotFound({ message = 'Esse bichinho se escondeu!' }: { message?: string }) {
  return (
    <View style={styles.root}>
      <Mascot pose="explore" height={180} />
      <AppText variant="title" align="center">
        {message}
      </AppText>
      <AppText variant="body" align="center">
        Vamos procurar outro?
      </AppText>
      <BigButton label="Voltar ao início" icon="house" onPress={() => router.replace('/')} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.cream,
  },
  button: { alignSelf: 'stretch' },
});
