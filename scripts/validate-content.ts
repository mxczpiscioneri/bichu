/**
 * npm run validate:content
 *
 * Checks the animal seed (required fields, taxonomies, duplicate ids, invalid
 * references, inconsistent challengeFlags, missing media files), the challenge
 * templates, the legacy manifest and the generated media registry.
 */
import { readdirSync, readFileSync } from 'node:fs';

import raw from '../content/animals/legacy-seed.json';
import templates from '../content/challenges/templates.json';
import { availableTemplatesFor } from '../src/challenges/engine';
import { validateTemplates } from '../src/challenges/templates';
import { CHALLENGE_TEMPLATE_IDS } from '../src/challenges/types';
import { formatIssue, validateAnimals } from '../src/content/validation';
import { createRng } from '../src/utils/random';
import { fileExists, fromRoot } from './lib/paths';
import { readSeedAnimals, REGISTRY_PATH, renderRegistry } from './lib/registry';

let errors = 0;
let warnings = 0;
const fail = (message: string) => {
  errors += 1;
  console.error(`ERRO  ${message}`);
};

// 1. Animals
const { animals, issues } = validateAnimals(raw.animals, { fileExists });
for (const issue of issues) {
  if (issue.severity === 'error') errors += 1;
  else warnings += 1;
  (issue.severity === 'error' ? console.error : console.warn)(formatIssue(issue));
}

// 2. Templates
const iconNames = readdirSync(fromRoot('assets/ui/icons'))
  .filter((f) => f.endsWith('.png'))
  .map((f) => f.replace(/\.png$/, ''));
for (const issue of validateTemplates(templates, iconNames)) fail(`[template ${issue.templateId}] ${issue.message}`);

// 3. Legacy manifest ↔ seed
const manifest = JSON.parse(readFileSync(fromRoot('legacy/ASSET_MANIFEST.json'), 'utf8')) as {
  animals: { id: string }[];
};
const seedIds = new Set(raw.animals.map((a) => a.id));
const manifestIds = new Set(manifest.animals.map((a) => a.id));
[...seedIds]
  .filter((id) => !manifestIds.has(id))
  .forEach((id) => console.warn(`AVISO [${id}] não está no ASSET_MANIFEST (asset não legado).`));
[...manifestIds]
  .filter((id) => !seedIds.has(id))
  .forEach((id) => fail(`[${id}] está no ASSET_MANIFEST mas não no seed.`));
if (!fileExists('assets/ui/sounds/correct.mp3')) fail('assets/ui/sounds/correct.mp3 ausente (npm run assets:fetch).');

// 4. Generated registry in sync with the seed
const registry = fileExists(REGISTRY_PATH) ? readFileSync(fromRoot(REGISTRY_PATH), 'utf8') : '';
if (registry !== renderRegistry(readSeedAnimals()))
  fail(`${REGISTRY_PATH} desatualizado — rode \`npm run assets:registry\`.`);

// 5. Every animal must be playable (at least 2 challenge types in each level)
if (animals.length > 0) {
  const rng = createRng(1);
  for (const animal of animals) {
    for (const level of ['explorer', 'adventurer'] as const) {
      const types = availableTemplatesFor(animal, level, animals, CHALLENGE_TEMPLATE_IDS, rng);
      if (types.length < 2)
        fail(`[${animal.id}] só ${types.length} desafio(s) possíveis no nível ${level}; a descoberta exige 2.`);
    }
  }
}

const statusNote =
  raw.status === 'draft-needs-content-review' ? ' (conteúdo em rascunho: revisar antes de publicar)' : '';
console.log(`\n${raw.animals.length} animais · ${errors} erro(s) · ${warnings} aviso(s)${statusNote}`);
process.exit(errors > 0 ? 1 : 0);
