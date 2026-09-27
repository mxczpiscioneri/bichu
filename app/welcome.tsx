import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/brand/Logo';
import { Mascot } from '@/components/brand/Mascot';
import { BigButton } from '@/components/ui/BigButton';
import { HabitatScene } from '@/components/ui/HabitatScene';
import { colors, spacing } from '@/theme';

/** First launch: brand moment, then the mode choice. */
export default function WelcomeScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.ground}>
        <HabitatScene scene="forest" />
      </View>
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <View style={styles.logo}>
          <Logo width={250} />
        </View>
        <View style={styles.mascot}>
          <Mascot pose="wave" height={380} />
        </View>
        <BigButton label="Vamos descobrir!" icon="footprints" onPress={() => router.replace('/choose-level')} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%' },
  content: { flex: 1, padding: spacing.lg, justifyContent: 'space-between' },
  logo: { alignItems: 'center', paddingTop: spacing.xl },
  mascot: { alignItems: 'center' },
});
