import models from '../../assets/animals/models/models.json';

import { getAnimal } from './animals';

interface ModelEntry {
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export interface ModelCreditGroup {
  author: string;
  license: string;
  licenseUrl: string;
  /** Animal names (pt-BR) with their source pages. */
  items: { name: string; sourceUrl: string }[];
}

const LICENSE_LABELS: Record<string, string> = {
  'CC-BY-3.0': 'CC BY 3.0',
  'CC0-1.0': 'CC0 1.0 (domínio público)',
};

export const licenseLabel = (license: string) => LICENSE_LABELS[license] ?? license;

/**
 * 3D model credits grouped by author + license, straight from models.json, so a new
 * model is credited as soon as it is registered (CC BY requires visible attribution).
 */
export function modelCredits(): ModelCreditGroup[] {
  const groups = new Map<string, ModelCreditGroup>();
  for (const [id, entry] of Object.entries(models as Record<string, ModelEntry>)) {
    const key = `${entry.author}|${entry.license}`;
    const group = groups.get(key) ?? {
      author: entry.author,
      license: entry.license,
      licenseUrl: entry.licenseUrl,
      items: [],
    };
    group.items.push({ name: getAnimal(id)?.name.ptBR ?? id, sourceUrl: entry.sourceUrl });
    groups.set(key, group);
  }
  return [...groups.values()].map((group) => ({
    ...group,
    items: group.items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
  }));
}

export const OTHER_CREDITS = [
  { title: 'Ilustrações, sons e locuções', text: 'Acervo do Zoo Babies / AnimalSounds.' },
  { title: 'Ícones', text: 'Microsoft Fluent Emoji (licença MIT).' },
  { title: 'Fontes', text: 'Fredoka e Nunito (SIL Open Font License).' },
  { title: 'Mascote', text: 'Bichu, o Guardião da Floresta.' },
];
