import { useWindowDimensions } from 'react-native';

import { spacing } from '@/theme';

const SCREEN_PADDING = spacing.lg - 4;
const MAX_CONTENT = 640;

/** Width of one column for an N-column grid inside a standard screen. */
export function useGridWidth(columns: number, gap: number, extraPadding = 0): number {
  const { width } = useWindowDimensions();
  const content = Math.min(width, MAX_CONTENT) - SCREEN_PADDING * 2 - extraPadding * 2;
  return Math.floor((content - gap * (columns - 1)) / columns);
}
