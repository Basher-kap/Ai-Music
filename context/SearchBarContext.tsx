// context/SearchBarContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';
import { ViewStyle, TextStyle } from 'react-native';

interface ThemeSearchBarStyle {
  container: ViewStyle;  // border, shadow, borderRadius only — no backgroundColor
  gradientColors: [string, string, ...string[]];
  gradientStart: { x: number; y: number };
  gradientEnd: { x: number; y: number };
  input: TextStyle;
  placeholderColor: string;
}

const themeSearchBarStyles: Record<ThemeKey, ThemeSearchBarStyle> = {
  nostalgia: {
    container: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(142, 232, 180, 0.45)',
      shadowColor: 'rgba(126, 200, 160, 0.4)',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 12,
      shadowOpacity: 1,
      elevation: 5,
    },
    // Because nostalgia is organic — diagonal like sunlight through leaves
    gradientColors: ['rgba(15, 35, 22, 0.85)', 'rgba(30, 60, 40, 0.7)', 'rgba(45, 80, 55, 0.55)'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
    input: { color: '#d4f0e0', fontSize: 14 },
    placeholderColor: 'rgba(142, 232, 180, 0.45)',
  },

  refreshing: {
    container: {
      borderRadius: 99,
      borderWidth: 1,
      borderColor: 'rgba(92, 225, 230, 0.4)',
      shadowColor: 'rgba(92, 225, 230, 0.35)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 20,
      shadowOpacity: 1,
      elevation: 4,
    },
    // Because refreshing flows left to right like a stream
    gradientColors: ['rgba(10, 55, 70, 0.7)', 'rgba(20, 110, 130, 0.5)', 'rgba(180, 245, 250, 0.12)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: { color: '#e8feff', fontSize: 14 },
    placeholderColor: 'rgba(92, 225, 230, 0.45)',
  },

  love: {
    container: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      borderBottomLeftRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(255, 182, 210, 0.4)',
      shadowColor: 'rgba(255, 96, 144, 0.35)',
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 14,
      shadowOpacity: 1,
      elevation: 6,
    },
    // Because love fades softly downward like a blush
    gradientColors: ['rgba(40, 5, 22, 0.82)', 'rgba(80, 15, 45, 0.65)', 'rgba(120, 30, 65, 0.45)'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 0, y: 1 },
    input: { color: '#ffe0ee', fontSize: 14 },
    placeholderColor: 'rgba(255, 150, 190, 0.5)',
  },

  cheerful: {
    container: {
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 220, 50, 0.4)',
      borderBottomWidth: 2.5,
      borderBottomColor: 'rgba(255, 200, 0, 0.6)',
      shadowColor: 'rgba(255, 210, 50, 0.45)',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 16,
      shadowOpacity: 1,
      elevation: 6,
    },
    // Because cheerful radiates warmth from its center outward
    gradientColors: ['rgba(50, 28, 0, 0.78)', 'rgba(80, 45, 0, 0.62)', 'rgba(110, 65, 0, 0.45)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: { color: '#fff8dc', fontSize: 14 },
    placeholderColor: 'rgba(255, 210, 80, 0.5)',
  },

  emo: {
    container: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#2a2a2a',
      borderBottomWidth: 2,
      borderBottomColor: '#444',
      shadowColor: 'rgba(0, 0, 0, 0.9)',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      shadowOpacity: 1,
      elevation: 5,
    },
    // Because emo sinks into darkness — near black with a faint violet undertone
    gradientColors: ['rgba(4, 3, 8, 0.95)', 'rgba(12, 8, 20, 0.88)'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 0, y: 1 },
    input: { color: '#cccccc', fontSize: 14 },
    placeholderColor: 'rgba(150, 140, 170, 0.45)',
  },

  aspire: {
    container: {
      borderRadius: 99,
      borderWidth: 1,
      borderColor: 'rgba(160, 240, 255, 0.3)',
      shadowColor: 'rgba(0, 210, 255, 0.3)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 22,
      shadowOpacity: 1,
      elevation: 6,
    },
    // Because aspire stretches toward the cosmos — deep space to faint starlight
    gradientColors: ['rgba(5, 3, 25, 0.9)', 'rgba(12, 28, 85, 0.72)', 'rgba(0, 75, 120, 0.45)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: { color: '#e0f8ff', fontSize: 14 },
    placeholderColor: 'rgba(160, 240, 255, 0.4)',
  },

  determination: {
    container: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      borderWidth: 1,
      borderTopWidth: 2.5,
      borderTopColor: 'rgba(255, 107, 53, 0.7)',
      borderColor: 'rgba(255, 107, 53, 0.3)',
      shadowColor: 'rgba(255, 107, 53, 0.45)',
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
      shadowOpacity: 1,
      elevation: 7,
    },
    // Because determination burns from ember to fire — dark base rising to heat
    gradientColors: ['rgba(12, 5, 0, 0.88)', 'rgba(45, 18, 0, 0.72)', 'rgba(80, 30, 0, 0.55)'],
    gradientStart: { x: 0, y: 1 },
    gradientEnd: { x: 0, y: 0 },
    input: { color: '#ffe0d0', fontSize: 14 },
    placeholderColor: 'rgba(255, 130, 80, 0.5)',
  },

  wrath: {
    container: {
      borderRadius: 0,
      borderWidth: 1,
      borderLeftWidth: 3,
      borderColor: 'rgba(139, 0, 0, 0.5)',
      borderLeftColor: '#cc0000',
      shadowColor: 'rgba(180, 0, 0, 0.5)',
      shadowOffset: { width: -5, height: 0 },
      shadowRadius: 16,
      shadowOpacity: 1,
      elevation: 6,
    },
    // Because wrath bleeds from the left — blood red to total darkness
    gradientColors: ['rgba(35, 0, 0, 0.9)', 'rgba(15, 0, 0, 0.82)', 'rgba(5, 0, 0, 0.78)'],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: { color: '#ffcccc', fontSize: 14 },
    placeholderColor: 'rgba(200, 80, 80, 0.45)',
  },
};

export function useSearchBarTheme() {
  const { activeTheme } = useTheme();
  const ThemeSearchBarStyles = themeSearchBarStyles[activeTheme] ?? themeSearchBarStyles.aspire;
  return { ThemeSearchBarStyles };
}