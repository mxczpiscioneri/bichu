import theme from '../../design/theme.json';

/** Brand palette (design/theme.json) plus soft tints derived for surfaces. */
export const colors = {
  ...theme.colors,
  forestDeep: '#234621',
  leafSoft: '#E5EFD9',
  sunSoft: '#FDF0CC',
  terraSoft: '#FCE4D2',
  flameSoft: '#F9DDD4',
  oceanSoft: '#D9F0F3',
  skySoft: '#E4F3FA',
  cacaoSoft: '#F1E6DA',
  inkSoft: '#6A6C62',
  line: '#EEE5D3',
  surface: '#FFFFFF',
  overlay: 'rgba(52, 54, 47, 0.45)',
} as const;

export const radius = theme.radius;
export const spacing = { ...theme.spacing, xxl: 48 } as const;
export const touch = theme.touchTargets;
export const motion = theme.motion;

export const fonts = {
  display: 'Fredoka_600SemiBold',
  displayBold: 'Fredoka_700Bold',
  body: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_800ExtraBold',
} as const;

export const shadows = {
  card: { boxShadow: '0px 6px 18px rgba(116, 66, 31, 0.10)' },
  raised: { boxShadow: '0px 10px 24px rgba(116, 66, 31, 0.16)' },
  button: { boxShadow: '0px 5px 0px rgba(35, 70, 33, 0.35)' },
} as const;

/** Habitat palettes (docs/BRAND.md → "Paletas por habitat"). */
export const tones = {
  farm: { background: colors.sunSoft, accent: colors.terra },
  forest: { background: colors.leafSoft, accent: colors.forest },
  savanna: { background: colors.sunSoft, accent: colors.terra },
  ocean: { background: colors.oceanSoft, accent: '#23808F' },
  home: { background: colors.terraSoft, accent: colors.flame },
  sky: { background: colors.skySoft, accent: '#2C7FA3' },
} as const;
export type Tone = keyof typeof tones;
