import { useLayout } from './useLayout';

/** Width of one column for an N-column grid inside a standard screen. */
export function useGridWidth(columns: number, gap: number, extraPadding = 0): number {
  const { contentWidth } = useLayout();
  const content = contentWidth - extraPadding * 2;
  return Math.floor((content - gap * (columns - 1)) / columns);
}
