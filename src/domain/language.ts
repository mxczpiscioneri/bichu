import type { Animal } from './animal';

/** "o leão" / "a abelha" */
export function withArticle(animal: Animal): string {
  return `${animal.name.article} ${animal.name.ptBR.toLocaleLowerCase('pt-BR')}`;
}

/** "do leão" / "da abelha" */
export function withDe(animal: Animal): string {
  return `d${withArticle(animal)}`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase('pt-BR') + text.slice(1);
}

export type TemplateTokens = {
  animal?: Animal;
  answer?: string;
};

/** Fills `{animal}`, `{Animal}`, `{deAnimal}` and `{answer}` in a template string. */
export function fillTemplate(template: string, tokens: TemplateTokens): string {
  const { animal, answer } = tokens;
  return template
    .replaceAll('{Animal}', animal ? capitalize(withArticle(animal)) : '')
    .replaceAll('{animal}', animal ? withArticle(animal) : '')
    .replaceAll('{deAnimal}', animal ? withDe(animal) : '')
    .replaceAll('{answer}', answer ?? '');
}
