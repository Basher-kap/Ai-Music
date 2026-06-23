// context/SongItemContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';
import { ViewStyle, TextStyle } from 'react-native';

interface ThemeSongItemStyle {
  card: ViewStyle;                          // border, shadow, shape — no backgroundColor
  gradientColors: [string, string, ...string[]];
  gradientStart: { x: number; y: number };
  gradientEnd: { x: number; y: number };
  title: TextStyle;
  artist: TextStyle;
  chip: ViewStyle;                          // shape only — bg comes from THEME_ACCENTS
  chipText: TextStyle;
}

const themeSongItemStyles: Record<ThemeKey, ThemeSongItemStyle> = {
  nostalgia: {
    card: {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 18,
      borderWidth: 1,
      borderColor: '#b48c50',
      borderLeftWidth: 3,
      borderLeftColor: '#d2b478',
      shadowColor: '#a0783c',
      shadowOffset: { width: 3, height: 3 },
      shadowRadius: 0,
      shadowOpacity: 0.7,
      elevation: 4,
    },
    gradientColors: ['rgba(45, 22, 5, 0.92)', 'rgba(62, 35, 10, 0.82)', 'rgba(80, 48, 14, 0.72)'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
    title: {
      color: '#ffd699',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(210, 180, 120, 0.7)',
      fontSize: 10,
    },
    chip: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(180, 140, 80, 0.5)',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#000000',
      textTransform: 'capitalize',
    },
  },

  refreshing: {
    card: {
      borderRadius: 99,
      borderWidth: 1.5,
      borderColor: 'rgba(92, 225, 230, 0.5)',
      borderRightWidth: 4,
      borderRightColor: '#00f5ff',
      shadowColor: '#00e5ff',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 14,
      shadowOpacity: 0.35,
      elevation: 4,
    },
    gradientColors: ['rgba(8, 45, 55, 0.92)', 'rgba(15, 90, 110, 0.82)', 'rgba(30, 140, 160, 0.72)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    title: {
      color: '#e8feff',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(92, 225, 230, 0.65)',
      fontSize: 10,
    },
    chip: {
      borderRadius: 99,
      borderWidth: 1,
      borderColor: 'rgba(92, 225, 230, 0.4)',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#003d40',
      textTransform: 'capitalize',
    },
  },

  love: {
    card: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      borderBottomLeftRadius: 4,
      shadowColor: '#ff007f',
      shadowOffset: { width: 4, height: 4 },
      shadowRadius: 0,
      shadowOpacity: 0.9,
      elevation: 6,
    },
    gradientColors: ['rgba(255, 227, 241, 0.85)', 'rgba(255, 179, 217, 0.75)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    title: {
      color: '#6c032d',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(108, 3, 45, 0.7)',
      fontSize: 10,
    },
    chip: {
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      borderBottomRightRadius: 14,
      borderBottomLeftRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(255, 105, 180, 0.4)',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#3d0018',
      textTransform: 'capitalize',
    },
  },

  cheerful: {
    card: {
      borderRadius: 10,
      shadowColor: '#ff4d00',
      shadowOffset: { width: 6, height: 5 },
      shadowRadius: 0,
      shadowOpacity: 1,
      elevation: 6,
    },
    gradientColors: ['#ffee00c8', '#ffbb00c9'],    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    title: {
      color: '#000000',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: 10,
    },
    chip: {
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: '#000000',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#000000',
      textTransform: 'capitalize',
    },
  },

  emo: {
    card: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#101428',
      borderLeftWidth: 5,
      borderLeftColor: '#4895ef',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      shadowOpacity: 0.6,
      elevation: 5,
    },
    gradientColors: ['rgba(3, 4, 14, 0.95)', 'rgba(6, 8, 22, 0.88)', 'rgba(10, 13, 32, 0.80)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    title: {
      color: '#e8ecff',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(120, 149, 220, 0.65)',
      fontSize: 10,
    },
    chip: {
      borderRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(72, 149, 239, 0.35)',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#ffffff',
      textTransform: 'capitalize',
    },
  },

  aspire: {
    card: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    shadowColor:  'rgba(0, 180, 216, 0.72)',
    shadowOpacity: 0.7,
    elevation: 8,
    },
    gradientColors: ['rgba(3, 4, 94, 0.92)', 'rgba(0, 118, 182, 0.88)', 'rgba(0, 180, 216, 0.77)', 'rgba(144, 225, 239, 0.85)'],    gradientStart: { x: 0, y: 1 },
    gradientEnd: { x: 1, y: 0 },
    title: {
      color: '#ffffff',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 10,
    },
    chip: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#03045e',
      textTransform: 'capitalize',
    },
  },

  determination: {
    card: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderWidth: 1,
      borderTopWidth: 3,
      borderTopColor: '#ff5500',
      borderColor: 'rgba(58, 13, 0, 0.8)',
      shadowColor: '#ff4500',
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 18,
      shadowOpacity: 0.4,
      elevation: 8,
    },
    gradientColors: ['rgba(12, 3, 0, 0.95)', 'rgba(35, 10, 0, 0.85)', 'rgba(65, 22, 0, 0.75)'],
    gradientStart: { x: 0, y: 1 },
    gradientEnd: { x: 0, y: 0 },
    title: {
      color: '#ffe3cc',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(255, 140, 80, 0.65)',
      fontSize: 10,
    },
    chip: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 14,
      borderBottomRightRadius: 14,
      borderWidth: 1,
      borderColor: 'rgba(255, 85, 0, 0.35)',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#000000',
      textTransform: 'capitalize',
    },
  },

  wrath: {
    card: {
      borderRadius: 1,
      borderWidth: 1,
      borderLeftWidth: 6,
      borderColor: 'rgba(43, 0, 0, 0.7)',
      borderLeftColor: '#660708',
      shadowColor: '#ba181b',
      shadowOffset: { width: -5, height: 5 },
      shadowRadius: 12,
      shadowOpacity: 0.85,
      elevation: 9,
    },
    gradientColors: ['rgba(28, 0, 5, 0.95)', 'rgba(42, 0, 8, 0.87)', 'rgba(58, 0, 12, 0.78)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    title: {
      color: '#ffcccc',
      fontSize: 15,
    },
    artist: {
      color: 'rgba(200, 80, 80, 0.65)',
      fontSize: 10,
    },
    chip: {
      borderRadius: 1,
      borderWidth: 1,
      borderColor: 'rgba(100, 0, 0, 0.6)',
    },
    chipText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#ffffff',
      textTransform: 'capitalize',
    },
  },
};

export function useSongItemTheme() {
  const { activeTheme } = useTheme();
  const ThemeSongItemStyles = themeSongItemStyles[activeTheme] ?? themeSongItemStyles.aspire;
  return { ThemeSongItemStyles };
}