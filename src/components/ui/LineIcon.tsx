import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

/**
 * The few stroke icons that must be tinted (white speaker on coloured audio
 * buttons, quiet chevrons). Everything else uses the illustrated `Icon` set.
 */
const PATHS = {
  back: 'M15 5 8 12l7 7',
  forward: 'M9 5l7 7-7 7',
  arrowRight: 'M5 12h13M13 6l6 6-6 6',
} as const;

export type LineIconName = keyof typeof PATHS | 'speaker';

interface LineIconProps {
  name: LineIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function LineIcon({ name, size = 24, color = colors.ink, strokeWidth = 2.2 }: LineIconProps) {
  const stroke = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'speaker' ? (
        <>
          <Path
            d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"
            fill={color}
            stroke={color}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          <Path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" {...stroke} />
        </>
      ) : (
        <Path d={PATHS[name]} {...stroke} />
      )}
    </Svg>
  );
}
