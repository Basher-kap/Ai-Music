// context/TextContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';

export const themeTextColors: Record<ThemeKey, string> = {
  nostalgia:     '#7EC8A0',
  refreshing:    '#87CEEB',
  love:          '#FFB6C1',
  cheerful:      '#FFD700',
  emo:           '#9B59B6',
  determination: '#FF4500',
  wrath:         '#FF0000',
};

export const themeTextStyles: Record<ThemeKey, any> = {
  nostalgia: {
    title: {
      color: '#7EC8A0',
      fontFamily: 'serif', 
      fontSize: 24,
      letterSpacing: 2,
      textShadowColor: 'rgba(0, 35, 20, 0.9)', 
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
    },
    description: {
      color: 'rgba(200, 230, 210, 0.8)', 
      fontSize: 13, 
      lineHeight: 20, 
      fontFamily: 'serif',
      fontStyle: 'italic',
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    badge: {
      color: '#7EC8A0',
      fontSize: 10,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  },
  refreshing:    { title: {}, description: {} },
  love:          { title: {}, description: {} },
  cheerful:      { title: {}, description: {} },
  emo:           { title: {}, description: {} },
  determination: { title: {}, description: {} },
  wrath:         { title: {}, description: {} },
};

export function useTextTheme() {
  const { activeTheme } = useTheme();

  const textColor = activeTheme ? themeTextColors[activeTheme] : '#ffffff';
  const textStyles = activeTheme ? themeTextStyles[activeTheme] : { title: {}, description: {}, badge: {} };

  return { textColor, textStyles };
}