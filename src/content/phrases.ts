/** Bichu's voice: warm, curious, never "você errou". */
export const PHRASES = {
  correct: ['Boa!', 'Muito bem!', 'Isso mesmo!', 'Que legal!', 'Uhuul!'],
  tryAgain: ['Quase! Vamos tentar de novo?', 'Hmm… que tal outro?', 'Vamos tentar de novo?'],
  finished: ['Você é um grande explorador!', 'Que aventura!', 'Muito bem, explorador!'],
} as const;

export function phrase(list: readonly string[], index: number): string {
  return list[Math.abs(index) % list.length];
}
