import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimalGroup } from '@/components/brand/AnimalGroup';
import { Logo } from '@/components/brand/Logo';
import { AppText } from '@/components/ui/AppText';
import { BigButton } from '@/components/ui/BigButton';
import { HabitatScene } from '@/components/ui/HabitatScene';
import { colors, radius, shadows, spacing } from '@/theme';

/** First launch: the animal gang in the forest, then the mode choice. */
export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const groupWidth = Math.min(width, 520) - spacing.md * 2;

  return (
    <View style={styles.root}>
      <HabitatScene scene="forest" />
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.group}>
          <AnimalGroup width={groupWidth} />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.panel}>
          <Logo width={200} />
          <AppText variant="heading" align="center">
            Seus amigos do mundo animal
          </AppText>
          <AppText variant="body" align="center" color={colors.cacao}>
            Ouça, brinque e descubra cada bichinho.
          </AppText>
          <BigButton
            label="Vamos descobrir!"
            icon="footprints"
            onPress={() => router.replace('/choose-level')}
            style={styles.button}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.forest },
  content: { flex: 1, padding: spacing.md, justifyContent: 'flex-end', gap: spacing.sm },
  group: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  panel: {
    backgroundColor: 'rgba(251, 245, 232, 0.94)',
    borderRadius: radius.lg + 8,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
    ...shadows.raised,
  },
  button: { alignSelf: 'stretch', marginTop: spacing.sm },
});
