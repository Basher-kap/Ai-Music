// context/TextContext.tsx
import { useTheme, ThemeKey } from './ThemeContext'; 

export const themeTextColors: Record<ThemeKey, string> = {
  nostalgia: '#90EE90',
  refreshing: '#87CEEB',
  love: '#FFB6C1',
  cheerful: '#FFD700',
  emo: '#9B59B6',
  determination: '#FF4500',
  wrath: '#FF0000',
};

const defaultTextColor = '#ffffff';

export function useTextTheme() {
  const { activeTheme } = useTheme(); 
  const textColor = activeTheme ? themeTextColors[activeTheme] : defaultTextColor;
  return { textColor };
}