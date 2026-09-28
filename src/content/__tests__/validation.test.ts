import seed from '../../../content/animals/legacy-seed.json';
import templates from '../../../content/challenges/templates.json';
import { validateTemplates } from '@/challenges/templates';

import { validateAnimals } from '../validation';

type Raw = Record<string, unknown> & { id: string };
const clone = (): Raw[] => JSON.parse(JSON.stringify(seed.animals));
const lion = (list: Raw[]) => list.find((a) => a.id === 'lion') as Raw;
const errorsOf = (raw: unknown, fileExists?: (p: string) => boolean) =>
  validateAnimals(raw, { fileExists }).issues.filter((i) => i.severity === 'error');

describe('content validation', () => {
  it('accepts the current seed', () => {
    const { animals, issues } = validateAnimals(seed.animals);
    expect(issues.filter((i) => i.severity === 'error')).toEqual([]);
    expect(animals).toHaveLength(22);
  });

  it('detects duplicate ids', () => {
    const list = clone();
    list.push({ ...lion(list) });
    expect(errorsOf(list).some((i) => i.field === 'id' && /duplicado/.test(i.message))).toBe(true);
  });

  it('detects missing required fields and invalid taxonomy values', () => {
    const list = clone();
    delete lion(list).diet;
    lion(list).bodyCovering = 'shell';
    const errors = errorsOf(list);
    expect(errors.some((i) => i.field === 'diet')).toBe(true);
    expect(errors.some((i) => i.field === 'bodyCovering')).toBe(true);
  });

  it('detects foods outside the taxonomy', () => {
    const list = clone();
    lion(list).foods = ['meat', 'pizza'];
    expect(errorsOf(list).some((i) => i.field === 'foods' && /pizza/.test(i.message))).toBe(true);
  });

  it('detects inconsistent challengeFlags', () => {
    const list = clone();
    lion(list).foods = [];
    expect(errorsOf(list).some((i) => i.field === 'challengeFlags.food')).toBe(true);
  });

  it('detects invalid references', () => {
    const list = clone();
    lion(list).parentAnimalId = 'unicorn';
    expect(errorsOf(list).some((i) => i.field === 'parentAnimalId')).toBe(true);
  });

  it('detects syllables that do not spell the name', () => {
    const list = clone();
    (lion(list).name as { syllables: string[] }).syllables = ['Le', 'o'];
    expect(errorsOf(list).some((i) => i.field === 'name.syllables')).toBe(true);
  });

  it('reports missing asset files (never silently)', () => {
    const errors = errorsOf(clone(), (path) => !path.includes('lion'));
    // image, sound, name audio and the 3D model
    expect(errors.filter((i) => i.animalId === 'lion' && /ausente/.test(i.message))).toHaveLength(4);
  });

  it('requires license metadata for 3D models', () => {
    const list = clone();
    const media = lion(list).media as Record<string, unknown>;
    media.model3d = 'assets/animals/models/lion.glb';
    delete media.model3dMeta;
    expect(errorsOf(list).some((i) => i.field === 'media.model3dMeta')).toBe(true);
  });

  it('validates challenge templates', () => {
    expect(validateTemplates(templates)).toEqual([]);
    const broken = { templates: [{ ...templates.templates[0], id: 'unknown_type' }] };
    expect(validateTemplates(broken).length).toBeGreaterThan(0);
  });
});
