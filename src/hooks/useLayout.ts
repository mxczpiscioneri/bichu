import { useWindowDimensions } from 'react-native';

import { spacing } from '@/theme';

/** Shortest side at which the layout switches to tablet sizing (iPad mini is 744pt). */
const TABLET_MIN_SIDE = 600;
const PHONE_MAX_CONTENT = 640;
/** Tablets use the whole width (grids add columns instead of stretching). Caps only very wide windows. */
const TABLET_MAX_CONTENT = 1280;

export interface Layout {
  isTablet: boolean;
  /** Horizontal padding of a standard screen. */
  padding: number;
  /** Max width of a screen's content column. */
  maxContent: number;
  /** Actual width of the content column on this window. */
  contentWidth: number;
  /** Multiplier for art and touch targets that should grow on tablets. */
  scale: number;
}

export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= TABLET_MIN_SIDE;
  const padding = isTablet ? spacing.xl : spacing.lg - 4;
  const maxContent = isTablet ? TABLET_MAX_CONTENT : PHONE_MAX_CONTENT;
  return {
    isTablet,
    padding,
    maxContent,
    contentWidth: Math.min(width - padding * 2, maxContent),
    scale: isTablet ? 1.4 : 1,
  };
}
