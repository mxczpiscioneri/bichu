import raw from '../../content/challenges/templates.json';

import type { Level } from '@/domain/animal';

import { CHALLENGE_TEMPLATE_IDS, type ChallengeTemplate, type ChallengeTemplateId } from './types';

export interface TemplateIssue {
  templateId: string;
  message: string;
}

/**
 * Validates templates.json against the engine's known challenge types.
 * `knownIcons` is optional so the check can run outside the bundler (icons are PNG modules).
 */
export function validateTemplates(input: unknown, knownIcons?: readonly string[]): TemplateIssue[] {
  const issues: TemplateIssue[] = [];
  if (typeof input !== 'object' || input === null || !Array.isArray((input as { templates?: unknown }).templates)) {
    return [{ templateId: '(file)', message: '"templates" deve ser uma lista.' }];
  }
  const templates = (input as { templates: Record<string, unknown>[] }).templates;
  const seen = new Set<string>();
  for (const template of templates) {
    const id = String(template.id);
    if (seen.has(id)) issues.push({ templateId: id, message: 'ID duplicado.' });
    seen.add(id);
    if (!(CHALLENGE_TEMPLATE_IDS as readonly string[]).includes(id)) {
      issues.push({ templateId: id, message: 'Tipo sem regra no Challenge Engine (src/challenges/rules.ts).' });
    }
    if (!['tap', 'drag', 'place'].includes(String(template.interaction))) {
      issues.push({ templateId: id, message: 'interaction deve ser "tap", "drag" ou "place".' });
    }
    for (const key of ['title', 'subtitle', 'prompt', 'hint', 'explanation'] as const) {
      if (typeof template[key] !== 'string' || template[key] === '') {
        issues.push({ templateId: id, message: `Campo obrigatório: ${key}.` });
      }
    }
    if (typeof template.icon !== 'string' || (knownIcons && !knownIcons.includes(template.icon))) {
      issues.push({ templateId: id, message: `Ícone desconhecido: ${String(template.icon)}.` });
    }
    const levels = template.levels as Record<string, { options?: unknown; enabled?: unknown }> | undefined;
    for (const level of ['explorer', 'adventurer']) {
      const config = levels?.[level];
      if (!config) {
        issues.push({ templateId: id, message: `Nível ausente: ${level}.` });
      } else if (config.enabled !== false && (typeof config.options !== 'number' || config.options < 2)) {
        issues.push({ templateId: id, message: `${level}: "options" deve ser >= 2.` });
      }
    }
  }
  return issues;
}

function load(): ChallengeTemplate[] {
  const issues = validateTemplates(raw);
  if (issues.length > 0) {
    throw new Error(`templates.json inválido:\n${issues.map((i) => `[${i.templateId}] ${i.message}`).join('\n')}`);
  }
  return raw.templates as ChallengeTemplate[];
}

export const challengeTemplates: readonly ChallengeTemplate[] = load();

export function getTemplate(id: ChallengeTemplateId): ChallengeTemplate {
  const template = challengeTemplates.find((t) => t.id === id);
  if (!template) throw new Error(`Template desconhecido: ${id}`);
  return template;
}

export function isTemplateId(value: string): value is ChallengeTemplateId {
  return (CHALLENGE_TEMPLATE_IDS as readonly string[]).includes(value);
}

export function optionCountFor(template: ChallengeTemplate, level: Level): number | null {
  const config = template.levels[level];
  if (config.enabled === false) return null;
  return config.options ?? 2;
}

/** Templates offered at a level (Explorer hides e.g. "class"). */
export function templatesForLevel(level: Level): ChallengeTemplate[] {
  return challengeTemplates.filter((t) => optionCountFor(t, level) !== null);
}
