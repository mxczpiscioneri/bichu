import type {
  AnimalClass,
  BodyCovering,
  Diet,
  Food,
  Habitat,
  Locomotion,
  Reproduction,
  SizeClass,
} from '@/domain/taxonomy';

import type { IconName } from './icons';

/**
 * pt-BR labels for closed taxonomies.
 * `label`: short text shown on buttons/chips. `phrase`: used inside sentences.
 */
export interface TaxonomyLabel {
  label: string;
  phrase: string;
  icon: IconName;
}

export const FOOD_LABELS: Record<Food, TaxonomyLabel> = {
  meat: { label: 'Carne', phrase: 'carne', icon: 'meat' },
  fish: { label: 'Peixe', phrase: 'peixe', icon: 'fish' },
  squid: { label: 'Lula', phrase: 'lula', icon: 'squid' },
  crustaceans: { label: 'Caranguejo', phrase: 'caranguejos e camarões', icon: 'crab' },
  small_aquatic_animals: { label: 'Bichinhos da água', phrase: 'bichinhos da água', icon: 'shrimp' },
  insects: { label: 'Insetos', phrase: 'insetos', icon: 'bug' },
  small_invertebrates: { label: 'Minhocas', phrase: 'minhocas e bichinhos', icon: 'worm' },
  grass: { label: 'Capim', phrase: 'capim', icon: 'herb' },
  hay: { label: 'Feno', phrase: 'feno', icon: 'hay' },
  leaves: { label: 'Folhas', phrase: 'folhas', icon: 'leaves' },
  plants: { label: 'Plantas', phrase: 'plantas', icon: 'seedling' },
  bark: { label: 'Casca de árvore', phrase: 'casca de árvore', icon: 'wood' },
  roots: { label: 'Raízes', phrase: 'raízes', icon: 'carrot' },
  flowers: { label: 'Flores', phrase: 'flores', icon: 'cherry' },
  fruits: { label: 'Frutas', phrase: 'frutas', icon: 'banana' },
  seeds: { label: 'Grãos', phrase: 'grãos e sementes', icon: 'corn' },
  nuts: { label: 'Castanhas', phrase: 'castanhas', icon: 'peanuts' },
  nectar: { label: 'Néctar', phrase: 'o néctar das flores', icon: 'blossom' },
  pollen: { label: 'Pólen', phrase: 'pólen', icon: 'sunflower' },
  prepared_food: { label: 'Ração', phrase: 'ração', icon: 'bowl' },
};

export const HABITAT_LABELS: Record<Habitat, TaxonomyLabel> = {
  farm: { label: 'Fazenda', phrase: 'na fazenda', icon: 'tractor' },
  home: { label: 'Casa', phrase: 'em casa', icon: 'house' },
  forest: { label: 'Floresta', phrase: 'na floresta', icon: 'tree' },
  savanna: { label: 'Savana', phrase: 'na savana', icon: 'sunrise' },
  grassland: { label: 'Campo', phrase: 'no campo', icon: 'hay' },
  wetland: { label: 'Brejo', phrase: 'em áreas alagadas', icon: 'lotus' },
  freshwater: { label: 'Rios e lagos', phrase: 'em rios e lagos', icon: 'park' },
  ocean: { label: 'Oceano', phrase: 'no oceano', icon: 'wave' },
  coast: { label: 'Praia', phrase: 'no litoral', icon: 'beach' },
  desert: { label: 'Deserto', phrase: 'no deserto', icon: 'desert' },
  mountains: { label: 'Montanhas', phrase: 'nas montanhas', icon: 'mountain' },
  urban: { label: 'Cidade', phrase: 'na cidade', icon: 'city' },
  mixed: { label: 'Vários lugares', phrase: 'em vários lugares', icon: 'earth' },
};

export const LOCOMOTION_LABELS: Record<Locomotion, TaxonomyLabel> = {
  walk: { label: 'Andando', phrase: 'andando', icon: 'paws' },
  run: { label: 'Correndo', phrase: 'correndo', icon: 'dash' },
  jump: { label: 'Pulando', phrase: 'pulando', icon: 'kangaroo' },
  climb: { label: 'Escalando', phrase: 'escalando', icon: 'sloth' },
  swim: { label: 'Nadando', phrase: 'nadando', icon: 'swimming' },
  fly: { label: 'Voando', phrase: 'voando', icon: 'wing' },
  slither: { label: 'Rastejando', phrase: 'rastejando', icon: 'snake' },
};

export const BODY_COVERING_LABELS: Record<BodyCovering, TaxonomyLabel> = {
  fur: { label: 'Pelos', phrase: 'pelos', icon: 'teddy' },
  wool: { label: 'Lã', phrase: 'lã', icon: 'yarn' },
  feathers: { label: 'Penas', phrase: 'penas', icon: 'feather' },
  scales: { label: 'Escamas', phrase: 'escamas', icon: 'lizard' },
  skin: { label: 'Pele lisa', phrase: 'pele', icon: 'hippo' },
  exoskeleton: { label: 'Casquinha', phrase: 'uma casquinha dura', icon: 'beetle' },
};

export const REPRODUCTION_LABELS: Record<Reproduction, TaxonomyLabel> = {
  eggs: { label: 'Do ovo', phrase: 'de ovos', icon: 'egg' },
  live_birth: { label: 'Da barriga da mãe', phrase: 'da barriga da mãe', icon: 'baby' },
};

export const CLASS_LABELS: Record<AnimalClass, TaxonomyLabel> = {
  mammal: { label: 'Mamífero', phrase: 'um mamífero', icon: 'baby' },
  bird: { label: 'Ave', phrase: 'uma ave', icon: 'dove' },
  reptile: { label: 'Réptil', phrase: 'um réptil', icon: 'lizard' },
  amphibian: { label: 'Anfíbio', phrase: 'um anfíbio', icon: 'lotus' },
  fish: { label: 'Peixe', phrase: 'um peixe', icon: 'fish' },
  insect: { label: 'Inseto', phrase: 'um inseto', icon: 'beetle' },
  arachnid: { label: 'Aracnídeo', phrase: 'um aracnídeo', icon: 'bug' },
  other: { label: 'Outro', phrase: 'um animal', icon: 'paws' },
};

export const DIET_LABELS: Record<Diet, string> = {
  herbivore: 'Herbívoro',
  carnivore: 'Carnívoro',
  omnivore: 'Onívoro',
  insectivore: 'Come insetos',
  nectar_pollen: 'Néctar e pólen',
  varies: 'Dieta variada',
};

export function soundNameOf(animal: { soundName?: { ptBR: string } }): string {
  return animal.soundName?.ptBR ?? 'som';
}

export const SIZE_LABELS: Record<SizeClass, string> = {
  tiny: 'bem pequenininho',
  small: 'pequeno',
  medium: 'médio',
  large: 'grande',
  very_large: 'enorme',
};
