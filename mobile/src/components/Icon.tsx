import Svg, { Circle, Path } from 'react-native-svg';
import { color as C } from '@/theme/tokens';

export type IconName =
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-right'
  | 'plus'
  | 'close'
  | 'home'
  | 'save'
  | 'borrow'
  | 'rewards'
  | 'flame'
  | 'lock'
  | 'share'
  | 'download'
  | 'info'
  | 'trending-up'
  | 'bike'
  | 'car'
  | 'trip'
  | 'house'
  | 'briefcase';

// Single-path icons (24x24 viewBox, stroke).
const PATHS: Record<Exclude<IconName, 'bike' | 'car' | 'info'>, string> = {
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  close: 'M18 6L6 18M6 6l12 12',
  home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H8v7H4a1 1 0 0 1-1-1z',
  save: 'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5',
  borrow: 'M12 3l9 5H3zM4 10v9M20 10v9M9 10v9M15 10v9M3 21h18',
  rewards: 'M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7C10.5 7 8 6.5 8 4.8 8 3.8 8.8 3 10 3c2.2 0 2 4 2 4zM12 7c1.5 0 4-.5 4-2.2 0-1-.8-1.8-2-1.8-2.2 0-2 4-2 4z',
  flame: 'M12 22c3.3 0 6-2.5 6-6 0-4-4-6-4-10 0 2-1.6 3-3 5-1-1-1-2-1-3-2 1.6-4 4-4 8 0 3.5 2.7 6 6 6z',
  lock: 'M6 10V8a6 6 0 0 1 12 0v2M5 10h14v11H5z',
  share: 'M4 12v8h16v-8M12 3v13M8 7l4-4 4 4',
  download: 'M12 3v12M8 11l4 4 4-4M4 21h16',
  'trending-up': 'M3 17l6-6 4 4 7-7M17 8h4v4',
  trip: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  house: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H8v7H4a1 1 0 0 1-1-1z',
  briefcase: 'M4 8h16v12H4zM9 8V5h6v3M4 13h16',
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color = C.textPrimary, strokeWidth = 1.8 }: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  if (name === 'bike') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={6} cy={17} r={3.2} {...common} />
        <Circle cx={18} cy={17} r={3.2} {...common} />
        <Path d="M6 17l3.5-7h5l-2.5 7M9.5 10l1.5-3h3" {...common} />
      </Svg>
    );
  }
  if (name === 'car') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M4 13l1.8-5h12.4L20 13M3 13h18v4H3zM3 17v2M21 17v2" {...common} />
        <Circle cx={7.5} cy={17} r={1.6} {...common} />
        <Circle cx={16.5} cy={17} r={1.6} {...common} />
      </Svg>
    );
  }
  if (name === 'info') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={9} {...common} />
        <Path d="M12 11v5M12 8h.01" {...common} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={PATHS[name]} {...common} />
    </Svg>
  );
}
