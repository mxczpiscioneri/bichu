import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(__dirname, '..', '..');

export function fromRoot(relative: string): string {
  return path.join(ROOT, relative);
}

export function fileExists(relative: string): boolean {
  const full = fromRoot(relative);
  return existsSync(full) && statSync(full).size > 0;
}
