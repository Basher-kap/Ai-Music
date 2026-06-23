// context/TextContainerThemeContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';
import { ViewStyle } from 'react-native';

interface ThemeTextContainerStyle {
  lyricsContainer: ViewStyle;
}

const themeTextContainerStyles: Record<ThemeKey, ThemeTextContainerStyle> = {
  nostalgia: {
    lyricsContainer: {
      backgroundColor: 'rgba(91, 112, 99, 0.45)',
      borderColor: '#8ee8b4',
      borderWidth: 1.5,
    },
  },

  refreshing: {
    lyricsContainer: {
      backgroundColor: 'rgba(90, 102, 108, 0.4)',
      borderColor: '#a0f0f5',
      borderWidth: 1.5,
    },
  },

  love: {
    lyricsContainer: {
      backgroundColor: 'rgba(102, 80, 85, 0.45)',
      borderColor: '#ffccd5',
      borderWidth: 1.5,
    },
  },

  cheerful: {
    lyricsContainer: {
      backgroundColor: 'rgba(88, 86, 72, 0.45)',
      borderColor: '#ffe066',
      borderWidth: 1.5,
    },
  },

  emo: {
    lyricsContainer: {
      backgroundColor: 'rgba(3, 4, 14, 0.45)',
      borderColor: 'rgba(72, 149, 239, 0.3)',
      borderWidth: 1,
    },
  },

  aspire: {
    lyricsContainer: {
      backgroundColor: 'rgba(8, 2, 22, 0.45)',
      borderColor: 'rgba(150, 80, 255, 0.3)',
      borderWidth: 1,
    },
  },

  determination: {
    lyricsContainer: {
      backgroundColor: 'rgba(10, 3, 0, 0.45)',
      borderColor: 'rgba(255, 107, 53, 0.3)',
      borderWidth: 1,
    },
  },

  wrath: {
    lyricsContainer: {
      backgroundColor: 'rgba(8, 0, 0, 0.45)',
      borderColor: 'rgba(186, 24, 27, 0.3)',
      borderWidth: 1,
    },
  },
};

export function useTextContainerTheme() {
  const { activeTheme } = useTheme();
  const ThemeTextContainerStyles = themeTextContainerStyles[activeTheme] ?? themeTextContainerStyles.aspire;
  return { ThemeTextContainerStyles };
}