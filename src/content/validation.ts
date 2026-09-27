import { CHALLENGE_FLAG_KEYS, type Animal } from '@/domain/animal';
import {
  ACTIVITIES,
  ANIMAL_CLASSES,
  BODY_COVERINGS,
  DIETS,
  DOMESTICATIONS,
  HABITATS,
  isFood,
  isOneOf,
  LOCOMOTIONS,
  REPRODUCTIONS,
  SCOPES,
  SIZE_CLASSES,
} from '@/domain/taxonomy';

export type IssueSeverity = 'error' | 'warning';

export interface ContentIssue {
  severity: IssueSeverity;
  animalId: string;
  field: string;
  message: string;
}

export interface ValidationOptions {
  /** Checks that a repository-relative media path exists. Omit to skip asset checks. */
  fileExists?: (relativePath: string) => boolean;
}

type Json = Record<string, unknown>;

const ID_PATTERN = /^[a-z0-9_]+$/;

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

/** Expected media paths derived from the id — keeps assets predictable. */
export function expectedMediaPaths(id: string, imageStyle: unknown = 'badge') {
  return {
    image: imageStyle === 'cutout' ? `assets/animals/art/${id}.png` : `assets/animals/images/${id}.png`,
    sound: `assets/animals/sounds/${id}.mp3`,
    nameAudio: `assets/animals/names/${id}_name.mp3`,
  } as const;
}

function validateAnimal(raw: unknown, index: number, options: ValidationOptions): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const id = isObject(raw) && typeof raw.id === 'string' ? raw.id : `#${index}`;
  const error = (field: string, message: string) => issues.push({ severity: 'error', animalId: id, field, message });
  const warn = (field: string, message: string) => issues.push({ severity: 'warning', animalId: id, field, message });

  if (!isObject(raw)) {
    error('(root)', 'Animal deve ser um objeto.');
    return issues;
  }

  if (typeof raw.id !== 'string' || !ID_PATTERN.test(raw.id)) error('id', 'Obrigatório, apenas [a-z0-9_].');
  if (!isOneOf(SCOPES, raw.scope)) error('scope', `Valor inválido: ${String(raw.scope)}.`);

  const name = raw.name;
  if (!isObject(name) || typeof name.ptBR !== 'string' || name.ptBR.trim() === '') {
    error('name.ptBR', 'Obrigatório.');
  } else {
    if (name.article !== 'o' && name.article !== 'a') error('name.article', 'Use "o" ou "a".');
    if (!isStringArray(name.syllables) || name.syllables.length === 0) {
      error('name.syllables', 'Obrigatório (lista de sílabas).');
    } else if (normalize(name.syllables.join('')) !== normalize(name.ptBR)) {
      error('name.syllables', `As sílabas (${name.syllables.join('-')}) não formam "${name.ptBR}".`);
    }
  }

  const taxonomy = raw.taxonomy;
  if (!isObject(taxonomy) || !isOneOf(ANIMAL_CLASSES, taxonomy.class)) error('taxonomy.class', 'Classe inválida.');

  const media = raw.media;
  if (!isObject(media)) {
    error('media', 'Obrigatório.');
  } else if (typeof raw.id === 'string') {
    if (media.imageStyle !== undefined && media.imageStyle !== 'badge' && media.imageStyle !== 'cutout') {
      error('media.imageStyle', 'Use "badge" ou "cutout".');
    }
    const expected = expectedMediaPaths(raw.id, media.imageStyle);
    for (const key of ['image', 'sound', 'nameAudio'] as const) {
      const value = media[key];
      if (typeof value !== 'string' || value === '') {
        error(`media.${key}`, 'Obrigatório.');
        continue;
      }
      if (value !== expected[key]) warn(`media.${key}`, `Esperado "${expected[key]}" pela convenção de nomes.`);
      if (options.fileExists && !options.fileExists(value)) error(`media.${key}`, `Arquivo ausente: ${value}`);
    }
    const model = media.model3d;
    if (model !== undefined && model !== null) {
      if (typeof model !== 'string' || !/\.(glb|gltf)$/.test(model)) {
        error('media.model3d', 'Use um caminho .glb/.gltf ou null.');
      } else {
        if (options.fileExists && !options.fileExists(model)) error('media.model3d', `Arquivo ausente: ${model}`);
        const meta = media.model3dMeta;
        if (!isObject(meta) || typeof meta.license !== 'string' || typeof meta.author !== 'string') {
          error('media.model3dMeta', 'Modelos 3D exigem metadados com license e author.');
        }
      }
    }
  }

  if (raw.soundGroup !== undefined && raw.soundGroup !== null && typeof raw.soundGroup !== 'string') {
    error('soundGroup', 'Deve ser texto ou null.');
  }
  if (raw.soundName !== undefined && (!isObject(raw.soundName) || typeof raw.soundName.ptBR !== 'string')) {
    error('soundName', 'Use { "ptBR": "..." }.');
  }

  const habitats = raw.habitats;
  if (!isStringArray(habitats) || habitats.length === 0) error('habitats', 'Obrigatório (lista não vazia).');
  else habitats.filter((h) => !isOneOf(HABITATS, h)).forEach((h) => error('habitats', `Habitat desconhecido: ${h}`));

  if (!isStringArray(raw.regions)) error('regions', 'Obrigatório (lista).');
  if (!isOneOf(DIETS, raw.diet)) error('diet', `Dieta inválida: ${String(raw.diet)}.`);

  const foods = raw.foods;
  if (!isStringArray(foods)) error('foods', 'Obrigatório (lista).');
  else foods.filter((f) => !isFood(f)).forEach((f) => error('foods', `Alimento fora da taxonomia: ${f}`));

  const locomotion = raw.locomotion;
  if (!isStringArray(locomotion) || locomotion.length === 0) error('locomotion', 'Obrigatório (lista não vazia).');
  else locomotion.filter((l) => !isOneOf(LOCOMOTIONS, l)).forEach((l) => error('locomotion', `Valor desconhecido: ${l}`));

  if (!isOneOf(BODY_COVERINGS, raw.bodyCovering)) error('bodyCovering', 'Valor inválido.');
  if (!isOneOf(REPRODUCTIONS, raw.reproduction)) error('reproduction', 'Valor inválido.');
  if (!Array.isArray(raw.activity) || !raw.activity.every((a) => isOneOf(ACTIVITIES, a))) error('activity', 'Valor inválido.');
  if (!isOneOf(DOMESTICATIONS, raw.domestication)) error('domestication', 'Valor inválido.');
  if (!isOneOf(SIZE_CLASSES, raw.sizeClass)) error('sizeClass', 'Valor inválido.');

  const content = raw.content;
  if (!isObject(content)) {
    error('content', 'Obrigatório.');
  } else {
    for (const key of ['preschool', 'kids', 'curiosities'] as const) {
      if (!isStringArray(content[key])) error(`content.${key}`, 'Obrigatório (lista de frases).');
    }
    if (isStringArray(content.preschool) && content.preschool.length === 0) {
      warn('content.preschool', 'Sem frases para o modo Explorador.');
    }
  }

  const flags = raw.challengeFlags;
  if (!isObject(flags)) {
    error('challengeFlags', 'Obrigatório.');
  } else {
    for (const key of CHALLENGE_FLAG_KEYS) {
      if (typeof flags[key] !== 'boolean') error(`challengeFlags.${key}`, 'Obrigatório (true/false).');
    }
    for (const key of Object.keys(flags)) {
      if (!(CHALLENGE_FLAG_KEYS as readonly string[]).includes(key)) warn(`challengeFlags.${key}`, 'Flag desconhecida.');
    }
    // Inconsistent flags: a challenge enabled without data to support it.
    if (flags.food === true && (!isStringArray(foods) || foods.length === 0)) {
      error('challengeFlags.food', 'Desafio de alimentação ativo, mas "foods" está vazio.');
    }
    if (flags.food === true && raw.diet === 'varies') {
      error('challengeFlags.food', 'Dieta "varies" é ambígua demais para um desafio de alimentação.');
    }
    if (flags.habitat === true && isStringArray(habitats) && habitats.every((h) => h === 'mixed')) {
      error('challengeFlags.habitat', 'Desafio de habitat ativo, mas só há "mixed".');
    }
  }

  return issues;
}

export interface ValidationResult {
  animals: Animal[];
  issues: ContentIssue[];
}

/** Validates the raw seed. Cross-animal checks: duplicate ids and references. */
export function validateAnimals(rawAnimals: unknown, options: ValidationOptions = {}): ValidationResult {
  if (!Array.isArray(rawAnimals)) {
    return {
      animals: [],
      issues: [{ severity: 'error', animalId: '(seed)', field: 'animals', message: 'Deve ser uma lista.' }],
    };
  }

  const issues = rawAnimals.flatMap((raw, index) => validateAnimal(raw, index, options));
  const ids = rawAnimals.map((raw) => (isObject(raw) ? raw.id : undefined));
  const seen = new Set<unknown>();
  ids.forEach((id) => {
    if (seen.has(id)) issues.push({ severity: 'error', animalId: String(id), field: 'id', message: 'ID duplicado.' });
    seen.add(id);
  });

  rawAnimals.forEach((raw) => {
    if (!isObject(raw)) return;
    const parent = raw.parentAnimalId;
    if (parent !== undefined && parent !== null) {
      if (parent === raw.id) {
        issues.push({ severity: 'error', animalId: String(raw.id), field: 'parentAnimalId', message: 'Não pode apontar para si mesmo.' });
      } else if (!ids.includes(parent)) {
        issues.push({ severity: 'error', animalId: String(raw.id), field: 'parentAnimalId', message: `Referência inválida: ${String(parent)}` });
      }
    }
  });

  const hasErrors = issues.some((issue) => issue.severity === 'error');
  return { animals: hasErrors ? [] : (rawAnimals as Animal[]), issues };
}

export function formatIssue(issue: ContentIssue): string {
  const tag = issue.severity === 'error' ? 'ERRO ' : 'AVISO';
  return `${tag} [${issue.animalId}] ${issue.field}: ${issue.message}`;
}
