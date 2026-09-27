/** Accent- and case-insensitive "contains" (so "leao" finds "Leão"). */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function matchesSearch(text: string, query: string): boolean {
  const q = normalizeForSearch(query);
  return q === '' || normalizeForSearch(text).includes(q);
}
