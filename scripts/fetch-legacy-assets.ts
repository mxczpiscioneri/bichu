/**
 * Downloads the legacy AnimalSounds assets listed in legacy/ASSET_MANIFEST.json.
 *
 *   npm run assets:fetch            # download missing files
 *   npm run assets:fetch -- --force # re-download everything
 *
 * Only files listed in the manifest are fetched: keystore, Firebase config and
 * build files from the legacy repository are never copied.
 * Writes legacy/ASSET_CHECKSUMS.json and reports/asset-report.md.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { fileExists, fromRoot } from './lib/paths';

interface ManifestAnimal {
  id: string;
  image: string;
  animalSound: string;
  nameAudio: string;
  target: { image: string; animalSound: string; nameAudio: string };
}
interface Manifest {
  sourceRepository: string;
  sourceBranch: string;
  animals: ManifestAnimal[];
  uiSounds: { id: string; source: string; target: string }[];
}

const FORBIDDEN = [/\.jks$/, /\.keystore$/, /google-services\.json$/, /\/build\//];
const force = process.argv.includes('--force');
const manifest: Manifest = JSON.parse(readFileSync(fromRoot('legacy/ASSET_MANIFEST.json'), 'utf8'));
const repo = manifest.sourceRepository.replace('https://github.com/', '');
const base = `https://raw.githubusercontent.com/${repo}/${manifest.sourceBranch}`;

const jobs = [
  ...manifest.animals.flatMap((a) => [
    { id: a.id, kind: 'image', source: a.image, target: a.target.image },
    { id: a.id, kind: 'sound', source: a.animalSound, target: a.target.animalSound },
    { id: a.id, kind: 'name', source: a.nameAudio, target: a.target.nameAudio },
  ]),
  ...manifest.uiSounds.map((s) => ({ id: s.id, kind: 'ui', source: s.source, target: s.target })),
];

function looksValid(buffer: Buffer, target: string): boolean {
  if (target.endsWith('.png'))
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (target.endsWith('.mp3'))
    return buffer.subarray(0, 3).toString('latin1') === 'ID3' || (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0);
  return buffer.length > 0;
}

function download(url: string, destination: string): boolean {
  mkdirSync(path.dirname(destination), { recursive: true });
  const partial = `${destination}.part`;
  // curl honours HTTPS_PROXY and system CA configuration out of the box.
  const result = spawnSync('curl', ['-fsSL', '--retry', '3', '-o', partial, url], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  if (result.status !== 0) {
    rmSync(partial, { force: true });
    console.error(`  ✖ ${url}\n    ${result.stderr?.toString().trim()}`);
    return false;
  }
  renameSync(partial, destination);
  return true;
}

const failures: string[] = [];
let downloaded = 0;
for (const job of jobs) {
  if (FORBIDDEN.some((pattern) => pattern.test(job.source))) {
    failures.push(`${job.id}: caminho proibido no manifesto (${job.source})`);
    continue;
  }
  if (!force && fileExists(job.target)) continue;
  if (download(`${base}/${job.source}`, fromRoot(job.target))) downloaded += 1;
  else failures.push(`${job.id} (${job.kind}): falha ao baixar ${job.source}`);
}

const checksums: Record<string, string> = {};
const invalid: string[] = [];
for (const job of jobs) {
  if (!fileExists(job.target)) continue;
  const buffer = readFileSync(fromRoot(job.target));
  if (!looksValid(buffer, job.target)) invalid.push(`${job.target}: conteúdo não parece ${path.extname(job.target)}`);
  checksums[job.target] = createHash('sha256').update(buffer).digest('hex');
}
writeFileSync(fromRoot('legacy/ASSET_CHECKSUMS.json'), `${JSON.stringify(checksums, null, 2)}\n`);

const missing = jobs.filter((job) => !fileExists(job.target)).map((job) => `${job.id} (${job.kind}): ${job.target}`);
const animalFiles = jobs.filter((j) => j.kind !== 'ui' && fileExists(j.target)).length;
const report = [
  '# Relatório de assets legados',
  '',
  `Fonte: ${manifest.sourceRepository} (${manifest.sourceBranch})`,
  '',
  `- Animais no manifesto: ${manifest.animals.length}`,
  `- Assets de animais presentes: ${animalFiles} / ${manifest.animals.length * 3}`,
  `- Baixados agora: ${downloaded}`,
  `- Ausentes: ${missing.length}`,
  `- Inválidos: ${invalid.length}`,
  '',
  ...(missing.length ? ['## Ausentes', '', ...missing.map((m) => `- ${m}`), ''] : []),
  ...(invalid.length ? ['## Inválidos', '', ...invalid.map((m) => `- ${m}`), ''] : []),
  ...(failures.length ? ['## Falhas', '', ...failures.map((m) => `- ${m}`), ''] : []),
  'Lembrete: direitos de uso ainda precisam ser confirmados (legacy/ASSET_RIGHTS_CHECKLIST.md).',
  '',
].join('\n');
mkdirSync(fromRoot('reports'), { recursive: true });
writeFileSync(fromRoot('reports/asset-report.md'), report);
console.log(report);

if (missing.length || invalid.length || failures.length) process.exit(1);
