import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_HEIGHT } from '@/components/navigation/TabBar';
import { spacing } from '@/theme';

/** Bottom padding so scrolled content clears the floating tab bar. */
export function useTabBarInset(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, spacing.sm) + spacing.md;
}
