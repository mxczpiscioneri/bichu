import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';

/** Tab-screen title with the discreet adult-area gear on the right. */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="title" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
      </View>
      <SettingsButton />
    </View>
  );
}

export function SettingsButton() {
  return (
    <PressableScale
      onPress={() => router.push('/parents')}
      accessibilityLabel="Área dos pais"
      hitSlop={10}
      style={styles.gear}>
      <Icon name="gear" size={28} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  gear: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
