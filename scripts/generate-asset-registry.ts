/**
 * Regenerates src/content/media.generated.ts from the animal seed.
 * Fails (exit 1) if any referenced file is missing — never silently.
 */
import { writeFileSync } from 'node:fs';

import { fileExists, fromRoot } from './lib/paths';
import { readSeedAnimals, REGISTRY_PATH, renderRegistry } from './lib/registry';

const animals = readSeedAnimals();
const missing = animals.flatMap((a) =>
  [a.media.image, a.media.sound, a.media.nameAudio, a.media.model3d ?? null]
    .filter((p): p is string => typeof p === 'string')
    .filter((p) => !fileExists(p))
    .map((p) => `${a.id}: ${p}`),
);

if (missing.length > 0) {
  console.error(`✖ ${missing.length} arquivo(s) de mídia ausente(s):\n  ${missing.join('\n  ')}`);
  console.error('Rode `npm run assets:fetch` para baixar os assets legados.');
  process.exit(1);
}

writeFileSync(fromRoot(REGISTRY_PATH), renderRegistry(animals));
console.log(`✔ ${REGISTRY_PATH} gerado com ${animals.length} animais.`);
