// context/SearchBarContext.tsximport { useTheme, ThemeKey } from './ThemeContext';
import { useTheme, ThemeKey } from './ThemeContext';
import { ViewStyle, TextStyle } from 'react-native';

interface ThemeSearchBarStyle {
  container: ViewStyle;  
  gradientColors: [string, string, ...string[]];
  gradientStart: { x: number; y: number };
  gradientEnd: { x: number; y: number };
  input: TextStyle;
  placeholderColor: string;
}

const themeSearchBarStyles: Record<ThemeKey, ThemeSearchBarStyle> = {
  nostalgia: {
    container: {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 24,
      borderWidth: 1,
      borderColor: '#d2b478',
      borderLeftWidth: 4,
      borderLeftColor: '#b48c50',
      shadowColor: '#a0783c',
      shadowOffset: { width: 4, height: 4 },
      shadowRadius: 0,
      shadowOpacity: 0.8,
      elevation: 4,
    },
    gradientColors: [
      '#231505',
      '#37260e',
      '#4c3111',
    ],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
    input: {
      color: '#ffd699',
      fontSize: 14,
    },
    placeholderColor: 'rgba(210, 180, 120, 0.45)',
  },
  refreshing: {
    container: {
      borderRadius: 99,
      borderWidth: 2,
      borderColor: '#a3f7f5',
      borderRightWidth: 5,
      borderRightColor: '#00f5ff',
      shadowColor: '#00e5ff',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      shadowOpacity: 0.4,
      elevation: 5,
      backgroundColor: 'transparent',
    },
    gradientColors: [
      '#e0faf9',
      '#bbf5f2',
    ],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: {
      color: '#004d4a',
      fontSize: 14,
    },
    placeholderColor: 'rgba(0, 120, 115, 0.45)',
  },
  love: {
    container: {
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
      borderBottomRightRadius: 6,
      borderBottomLeftRadius: 14,
      borderWidth: 2,
      borderColor: '#ff69b4',
      borderBottomColor: '#ff007f',
      shadowColor: '#ff007f',
      shadowOffset: { width: 5, height: 4 },
      shadowRadius: 0,
      shadowOpacity: 1,
      elevation: 7,
      backgroundColor: 'transparent',
    },
    gradientColors: [
      '#ffe3f1',
      '#ffb3d9',
    ],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: {
      color: '#6c032d',
      fontSize: 14,
    },
    placeholderColor: 'rgba(104, 7, 44, 0.45)',
  },
  cheerful: {
    container: {
      borderRadius: 12,
      borderWidth: 2.5,
      borderColor: '#000000',
      borderBottomColor: '#000000',
      shadowColor: '#ff4d00',
      shadowOffset: { width: 6, height: 4 },
      shadowRadius: 0,
      shadowOpacity: 1,
      elevation: 6,
      backgroundColor: 'transparent',
    },
    gradientColors: [
      '#ffee00',
      '#ffbb00',
    ],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: {
      color: '#000000',
      fontSize: 14,
    },
    placeholderColor: 'rgba(0, 0, 0, 0.45)',
  },
  emo: {
    container: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#101428',
      borderLeftWidth: 6,
      borderLeftColor: '#4895ef',
      borderRightWidth: 6,
      borderRightColor: '#4895ef',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      shadowOpacity: 0.5,
      elevation: 5,
      backgroundColor: 'transparent',
    },
    gradientColors: [
      '#050714',
      '#0d1124',
    ],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: {
      color: '#f0f3ff',
      fontSize: 14,
    },
    placeholderColor: 'rgba(72, 149, 239, 0.35)',
  },
  aspire: {
    container: {
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#00b4d8',
      borderBottomWidth: 3,
      borderBottomColor: '#ff9e00',
      shadowColor: '#4361ee',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      shadowOpacity: 0.65,
      elevation: 7,
      backgroundColor: 'transparent',
    },
    gradientColors: [
      '#03045e',
      '#0077b6',
      '#00b4d8',
      '#90e0ef',
    ],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: {
      color: '#ffffff',
      fontSize: 14,
    },
    placeholderColor: 'rgba(255, 255, 255, 0.55)',
  },
  determination: {
    container: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      borderWidth: 1,
      borderColor: '#3a0d00',
      borderTopWidth: 4,
      borderTopColor: '#ff5500',
      shadowColor: '#ff4500',
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
      shadowOpacity: 0.4,
      elevation: 8,
    },
    gradientColors: [
      '#140500',
      '#2b0c00',
      '#471602',
    ],
    gradientStart: { x: 0, y: 1 },
    gradientEnd: { x: 0, y: 0 },
    input: {
      color: '#ffe3cc',
      fontSize: 14,
    },
    placeholderColor: 'rgba(255, 120, 50, 0.4)',
  },
  wrath: {
    container: {
      borderRadius: 1,
      borderWidth: 1.5,
      borderColor: '#2b0000',
      borderLeftWidth: 8,
      borderLeftColor: '#660708',
      shadowColor: '#ba181b',
      shadowOffset: { width: -5, height: 5 },
      shadowRadius: 12,
      shadowOpacity: 0.85,
      elevation: 9,
      backgroundColor: 'transparent',
    },
    gradientColors: [
      '#131313',
      '#1a0005',
      '#2d0c15',
    ],
    gradientStart: { x: 0, y: 0.5 },
    gradientEnd: { x: 1, y: 0.5 },
    input: {
      color: '#e5383b',
      fontSize: 14,
    },
    placeholderColor: 'rgba(242, 8, 16, 0.4)',
  },
};

export function useSearchBarTheme() {
  const { activeTheme } = useTheme();
  const ThemeSearchBarStyles = themeSearchBarStyles[activeTheme] ?? themeSearchBarStyles.aspire;
  return { ThemeSearchBarStyles };
}