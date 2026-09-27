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
}

/** Fills its container (absolute) with a landscape; place content on top. */
export function HabitatScene({ scene, style }: HabitatSceneProps) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.passThrough, style]} importantForAccessibility="no-hide-descendants">
      <Image source={SCENES[scene]} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
    </View>
  );
}

const styles = StyleSheet.create({
  passThrough: { pointerEvents: 'none' },
});
