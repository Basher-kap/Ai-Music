// context/TextContainerThemeContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';
import { ViewStyle } from 'react-native';

interface ThemeTextContainerStyle {
  lyricsContainer: ViewStyle;
  headerCenter: ViewStyle;
}

const themeTextContainerStyles: Record<ThemeKey, ThemeTextContainerStyle> = {
  nostalgia: {
    lyricsContainer: {
      backgroundColor: 'rgba(91, 112, 99, 0.45)',
      borderColor: '#8ee8b4',
      borderWidth: 1.5,
    },
    headerCenter: {
      backgroundColor: 'rgba(242, 252, 246, 0.45)',
      borderColor: 'rgba(142, 232, 180, 0.5)',
      borderWidth: 1,
    },
  },

  refreshing: {
    lyricsContainer: {
      backgroundColor: 'rgba(90, 102, 108, 0.4)',
      borderColor: '#a0f0f5',
      borderWidth: 1.5,
    },
    headerCenter: {
      backgroundColor: 'rgba(240, 250, 255, 0.4)',
      borderColor: 'rgba(160, 240, 245, 0.5)',
      borderWidth: 1,
    },
  },

  love: {
    lyricsContainer: {
      backgroundColor: 'rgba(102, 80, 85, 0.45)',
      borderColor: '#ffccd5',
      borderWidth: 1.5,
    },
    headerCenter: {
      backgroundColor: 'rgba(255, 245, 247, 0.45)',
      borderColor: 'rgba(255, 204, 213, 0.5)',
      borderWidth: 1,
    },
  },

  cheerful: {
    lyricsContainer: {
      backgroundColor: 'rgba(88, 86, 72, 0.45)',
      borderColor: '#ffe066',
      borderWidth: 1.5,
    },
    headerCenter: {
      backgroundColor: 'rgba(255, 253, 240, 0.45)',
      borderColor: 'rgba(255, 224, 102, 0.5)',
      borderWidth: 1,
    },
  },

  emo: {
    lyricsContainer: {
      backgroundColor: 'rgba(3, 4, 14, 0.45)',
      borderColor: 'rgba(72, 149, 239, 0.3)',
      borderWidth: 1,
    },
    headerCenter: {
      backgroundColor: 'rgba(3, 4, 14, 0.45)',
      borderColor: 'rgba(72, 149, 239, 0.2)',
      borderWidth: 1,
    },
  },

  aspire: {
    lyricsContainer: {
      backgroundColor: 'rgba(8, 2, 22, 0.45)',
      borderColor: 'rgba(150, 80, 255, 0.3)',
      borderWidth: 1,
    },
    headerCenter: {
      backgroundColor: 'rgba(8, 2, 22, 0.45)',
      borderColor: 'rgba(150, 80, 255, 0.2)',
      borderWidth: 1,
    },
  },

  determination: {
    lyricsContainer: {
      backgroundColor: 'rgba(10, 3, 0, 0.45)',
      borderColor: 'rgba(255, 107, 53, 0.3)',
      borderWidth: 1,
    },
    headerCenter: {
      backgroundColor: 'rgba(10, 3, 0, 0.45)',
      borderColor: 'rgba(255, 107, 53, 0.2)',
      borderWidth: 1,
    },
  },

  wrath: {
    lyricsContainer: {
      backgroundColor: 'rgba(8, 0, 0, 0.45)',
      borderColor: 'rgba(186, 24, 27, 0.3)',
      borderWidth: 1,
    },
    headerCenter: {
      backgroundColor: 'rgba(8, 0, 0, 0.45)',
      borderColor: 'rgba(186, 24, 27, 0.2)',
      borderWidth: 1,
    },
  },
};

export function useTextContainerTheme() {
  const { activeTheme } = useTheme();
  const ThemeTextContainerStyles = themeTextContainerStyles[activeTheme] ?? themeTextContainerStyles.aspire;
  return { ThemeTextContainerStyles };
}