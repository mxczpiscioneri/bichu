import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

/**
 * UI chrome icons (navigation, controls, settings). Drawn in-house as simple
 * rounded strokes so they stay quiet next to the colourful content icons.
 * Content (foods, habitats…) keeps using the Fluent illustrations in `Icon`.
 */
const PATHS = {
  home: 'M4 11.5 12 5l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5h-6v5H5.5A1.5 1.5 0 0 1 4 19z',
  explore: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5z',
  play: 'M9 4h3.2a1.8 1.8 0 1 1 3.6 0H19v4.2a1.8 1.8 0 1 1 0 3.6V16h-4.2a1.8 1.8 0 1 0-3.6 0H7v-4.2a1.8 1.8 0 1 1 0-3.6V4z',
  book: 'M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5zM5 20.5A2.5 2.5 0 0 0 7.5 21H19M9 7h6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 13.5l1.6 1.2-2 3.5-1.9-.7a7 7 0 0 1-1.7 1l-.3 2H9l-.3-2a7 7 0 0 1-1.7-1l-1.9.7-2-3.5 1.6-1.2a7 7 0 0 1 0-3L3.1 9.3l2-3.5 1.9.7a7 7 0 0 1 1.7-1L9 3.5h4l.3 2a7 7 0 0 1 1.7 1l1.9-.7 2 3.5-1.6 1.2a7 7 0 0 1 0 3z',
  back: 'M15 5 8 12l7 7',
  forward: 'M9 5l7 7-7 7',
  close: 'M6 6l12 12M18 6 6 18',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4',
  arrowRight: 'M5 12h13M13 6l6 6-6 6',
  globe:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.7 3.5 5.7 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-5.7-3.5-9s1-6.3 3.5-9z',
  mascot:
    'M12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM9 3.5c1 .8 1.7 1.8 2 3M15 3.5c-1 .8-1.7 1.8-2 3M9.5 12h.01M14.5 12h.01M10 15.5c1.2.8 2.8.8 4 0',
  cube: 'M12 3 20 7.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5v-5m0-3h.01',
  shield: 'M12 3 19 6v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4',
} as const;

export type LineIconName = keyof typeof PATHS | 'speaker' | 'lock' | 'playFill' | 'starFill';

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
      ) : name === 'lock' ? (
        <>
          <Rect x={5} y={10.5} width={14} height={10} rx={2.5} fill={color} />
          <Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...stroke} />
        </>
      ) : name === 'playFill' ? (
        <Path d="M8 5.5v13l10.5-6.5z" fill={color} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      ) : name === 'starFill' ? (
        <Path
          d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
          fill={color}
          stroke={color}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      ) : name === 'mascot' ? (
        <>
          <Path d={PATHS.mascot} {...stroke} />
          <Circle cx={9.5} cy={12} r={0.6} fill={color} />
          <Circle cx={14.5} cy={12} r={0.6} fill={color} />
        </>
      ) : (
        <Path d={PATHS[name]} {...stroke} />
      )}
    </Svg>
  );
}
