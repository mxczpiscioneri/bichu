import { Image } from 'expo-image';
import { StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

import type { Animal, Habitat } from '@/domain/animal';

/**
 * Illustrated habitat backgrounds (assets/habitats, 4:3). Ten scenes cover
 * every habitat in the content: coast shares the ocean scene and wetland the
 * river scene. Images are cropped with "cover", so keep subjects centred.
 */
const SCENES = {
  savanna: require('../../../assets/habitats/savanna.jpg'),
  grassland: require('../../../assets/habitats/grassland.jpg'),
  desert: require('../../../assets/habitats/desert.jpg'),
  forest: require('../../../assets/habitats/forest.jpg'),
  mountains: require('../../../assets/habitats/mountains.jpg'),
  ocean: require('../../../assets/habitats/ocean.jpg'),
  freshwater: require('../../../assets/habitats/freshwater.jpg'),
  farm: require('../../../assets/habitats/farm.jpg'),
  home: require('../../../assets/habitats/home.jpg'),
  city: require('../../../assets/habitats/city.jpg'),
} satisfies Record<string, ImageSourcePropType>;

export type SceneName = keyof typeof SCENES;

const SCENE_BY_HABITAT: Record<Habitat, SceneName> = {
  savanna: 'savanna',
  grassland: 'grassland',
  desert: 'desert',
  forest: 'forest',
  mixed: 'forest',
  mountains: 'mountains',
  ocean: 'ocean',
  coast: 'ocean',
  freshwater: 'freshwater',
  wetland: 'freshwater',
  farm: 'farm',
  home: 'home',
  urban: 'city',
};

export function sceneForHabitat(habitat: Habitat): SceneName {
  return SCENE_BY_HABITAT[habitat];
}

/** The animal's first (main) habitat. */
export function sceneForAnimal(animal: Animal): SceneName {
  return sceneForHabitat(animal.habitats.find((h) => h !== 'mixed') ?? animal.habitats[0]);
}

interface HabitatSceneProps {
  scene: SceneName;
  style?: StyleProp<ViewStyle>;
  /**
   * Backdrop mode: blurs and washes the painting so a character on top reads
   * clearly instead of blending into the leaves.
   */
  backdrop?: boolean;
}

/** Fills its container (absolute) with a landscape; place content on top. */
export function HabitatScene({ scene, style, backdrop = false }: HabitatSceneProps) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.passThrough, style]} importantForAccessibility="no-hide-descendants">
      <Image
        source={SCENES[scene]}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={150}
        blurRadius={backdrop ? 6 : 0}
      />
      {backdrop ? <View style={[StyleSheet.absoluteFill, styles.wash]} /> : null}
    </View>
  );
}

/** Soft light disc placed behind a character so it pops off a busy scene. */
export function Spotlight({ size, style }: { size: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.spotlight,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          boxShadow: `0px 0px ${Math.round(size * 0.25)}px ${Math.round(size * 0.12)}px rgba(255, 250, 235, 0.75)`,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  passThrough: { pointerEvents: 'none' },
  wash: { backgroundColor: 'rgba(251, 245, 232, 0.28)' },
  spotlight: { position: 'absolute', backgroundColor: 'rgba(255, 250, 235, 0.7)' },
});
