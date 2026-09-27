/**
 * npm run assets:art
 *
 * Switches every animal that has new art in assets/animals/art/<id>.png to it
 * (media.image + media.imageStyle = "cutout") and regenerates the media
 * registry. Art must be a square PNG with transparency (768×768 recommended).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

import { fromRoot } from './lib/paths';
import { readSeedAnimals, REGISTRY_PATH, renderRegistry } from './lib/registry';

const ART_DIR = 'assets/animals/art';
const SEED = 'content/animals/legacy-seed.json';

/** Width, height and colour type straight from the PNG header (no image library needed). */
function pngInfo(path: string): { width: number; height: number; hasAlpha: boolean } | null {
  const buffer = readFileSync(path);
  if (!buffer.subarray(1, 4).equals(Buffer.from('PNG'))) return null;
  const colorType = buffer[25];
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    hasAlpha: colorType === 6 || colorType === 4,
  };
}

const seed = JSON.parse(readFileSync(fromRoot(SEED), 'utf8')) as {
  animals: { id: string; media: Record<string, unknown> }[];
};
const ids = new Set(seed.animals.map((a) => a.id));
const files = existsSync(fromRoot(ART_DIR)) ? readdirSync(fromRoot(ART_DIR)).filter((f) => f.endsWith('.png')) : [];

const problems: string[] = [];
const applied: string[] = [];
for (const file of files) {
  const id = file.replace(/\.png$/, '');
  if (!ids.has(id)) {
    problems.push(`${file}: nenhum animal com id "${id}" no seed.`);
    continue;
  }
  const info = pngInfo(fromRoot(`${ART_DIR}/${file}`));
  if (!info) problems.push(`${file}: não é um PNG válido.`);
  else {
    if (info.width !== info.height) problems.push(`${file}: precisa ser quadrado (está ${info.width}×${info.height}).`);
    if (!info.hasAlpha) problems.push(`${file}: precisa ter fundo transparente (canal alfa).`);
  }
  const animal = seed.animals.find((a) => a.id === id)!;
  // Rebuild media keeping key order, with image/imageStyle pointing at the new art.
  const media: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(animal.media)) {
    if (key === 'imageStyle') continue;
    media[key] = value;
    if (key === 'image') {
      media.image = `${ART_DIR}/${file}`;
      media.imageStyle = 'cutout';
    }
  }
  animal.media = media;
  applied.push(id);
}

if (problems.length > 0) {
  console.error(`✖ Corrija antes de continuar:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

writeFileSync(fromRoot(SEED), `${JSON.stringify(seed, null, 2)}\n`);
writeFileSync(fromRoot(REGISTRY_PATH), renderRegistry(readSeedAnimals()));
const pending = [...ids].filter((id) => !applied.includes(id));
console.log(`✔ Arte nova em ${applied.length} animais: ${applied.join(', ')}`);
console.log(`  Ainda com a ilustração antiga (${pending.length}): ${pending.join(', ')}`);
