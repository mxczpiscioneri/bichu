import { Modal, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import type { Animal } from '@/domain/animal';
import { colors, radius, shadows, spacing } from '@/theme';

import { AnimalImage } from '../animal/AnimalImage';
import { Mascot } from '../brand/Mascot';
import { AppText } from '../ui/AppText';
import { BigButton } from '../ui/BigButton';
import { Icon } from '../ui/Icon';

interface DiscoveryCelebrationProps {
  animal: Animal | null;
  onClose: () => void;
}

/** "⭐ Animal descoberto!" — shown when an animal enters the Bichupédia. */
export function DiscoveryCelebration({ animal, onClose }: DiscoveryCelebrationProps) {
  return (
    <Modal visible={animal !== null} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {animal ? (
          <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.card}>
            <View style={styles.stars}>
              <Icon name="glowing" size={44} />
              <Icon name="star" size={56} />
              <Icon name="glowing" size={44} />
            </View>
            <AppText variant="title" align="center">
              Animal descoberto!
            </AppText>
            <View style={styles.imageRow}>
              <AnimalImage animalId={animal.id} size={150} />
              <View style={styles.mascot}>
                <Mascot pose="cheer" height={120} />
              </View>
            </View>
            <AppText variant="heading" align="center">
              {animal.name.ptBR} entrou na sua Bichupédia.
            </AppText>
            <BigButton label="Oba!" icon="party" onPress={onClose} style={styles.button} />
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.cream,
    borderRadius: radius.lg + 8,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.raised,
  },
  stars: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  imageRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  mascot: { marginLeft: -24 },
  button: { alignSelf: 'stretch' },
});
