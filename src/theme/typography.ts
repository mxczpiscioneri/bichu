import type { TextStyle } from 'react-native';

import { colors, fonts } from './tokens';

/** Large, rounded, highly legible. Child-facing text never goes below 17. */
export const typography = {
  hero: { fontFamily: fonts.displayBold, fontSize: 44, lineHeight: 50, color: colors.forest },
  title: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 38, color: colors.forest },
  heading: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, color: colors.ink },
  subheading: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 18, lineHeight: 26, color: colors.ink },
  bodyStrong: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 26, color: colors.ink },
  label: { fontFamily: fonts.bodyBold, fontSize: 17, lineHeight: 22, color: colors.ink },
  caption: { fontFamily: fonts.body, fontSize: 15, lineHeight: 20, color: colors.inkSoft },
  overline: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.cacao,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
