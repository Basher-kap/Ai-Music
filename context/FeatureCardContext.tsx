// context/FeatureCardContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';
import { ViewStyle } from 'react-native';

interface ThemeFeatureCardStyle {
  card: ViewStyle;
  iconContainer: ViewStyle;
}

const themeFeatureCardStyles: Record<ThemeKey, ThemeFeatureCardStyle> = {
  nostalgia: {
    card: {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(220, 185, 120, 0.55)',
      borderLeftWidth: 2,
      borderLeftColor: 'rgba(210, 180, 120, 0.8)',
      backgroundColor: 'rgba(255, 220, 160, 0.12)',
      shadowColor: 'rgba(180, 140, 80, 0.4)',
      shadowOffset: { width: 2, height: 2 },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 4,
    },
    iconContainer: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(210, 180, 120, 0.45)',
      backgroundColor: 'rgba(255, 220, 160, 0.18)',
    },
  },

  refreshing: {
    card: {
      borderRadius: 99,
      borderWidth: 1,
      borderColor: 'rgba(92, 225, 230, 0.5)',
      borderRightWidth: 3,
      borderRightColor: 'rgba(0, 245, 255, 0.7)',
      backgroundColor: 'rgba(92, 225, 230, 0.12)',
      shadowColor: 'rgba(0, 229, 255, 0.35)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 14,
      shadowOpacity: 1,
      elevation: 4,
    },
    iconContainer: {
      borderRadius: 99,
      borderWidth: 1,
      borderColor: 'rgba(92, 225, 230, 0.4)',
      backgroundColor: 'rgba(92, 225, 230, 0.15)',
    },
  },

  love: {
    card: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(255, 150, 190, 0.55)',
      borderBottomColor: 'rgba(255, 60, 130, 0.7)',
      backgroundColor: 'rgba(255, 160, 200, 0.14)',
      shadowColor: 'rgba(255, 0, 127, 0.35)',
      shadowOffset: { width: 3, height: 3 },
      shadowRadius: 0,
      shadowOpacity: 1,
      elevation: 5,
    },
    iconContainer: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 3,
      borderWidth: 1,
      borderColor: 'rgba(255, 150, 190, 0.45)',
      backgroundColor: 'rgba(255, 160, 200, 0.18)',
    },
  },

  cheerful: {
    card: {
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 210, 0, 0.55)',
      borderBottomWidth: 2.5,
      borderBottomColor: 'rgba(255, 160, 0, 0.75)',
      backgroundColor: 'rgba(255, 220, 0, 0.14)',
      shadowColor: '#ff4d00',
      shadowOffset: { width: 5, height: 4 },
      shadowRadius: 0,
      shadowOpacity: 1,
      elevation: 5,
    },
    iconContainer: {
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 210, 0, 0.45)',
      backgroundColor: 'rgba(255, 220, 0, 0.18)',
    },
  },

  emo: {
    card: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(72, 149, 239, 0.3)',
      borderLeftWidth: 4,
      borderLeftColor: 'rgba(72, 149, 239, 0.7)',
      backgroundColor: 'rgba(72, 149, 239, 0.10)',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      shadowOpacity: 0.6,
      elevation: 5,
    },
    iconContainer: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(72, 149, 239, 0.3)',
      backgroundColor: 'rgba(72, 149, 239, 0.12)',
    },
  },

  aspire: {
    card: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 4,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(150, 80, 255, 0.45)',
      backgroundColor: 'rgba(150, 80, 255, 0.12)',
      shadowColor: '#7b2ff7',
      shadowOffset: { width: 0, height: -3 },
      shadowRadius: 14,
      shadowOpacity: 0.5,
      elevation: 5,
    },
    iconContainer: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 3,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(150, 80, 255, 0.4)',
      backgroundColor: 'rgba(150, 80, 255, 0.15)',
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
      borderTopColor: 'rgba(255, 85, 0, 0.8)',
      borderColor: 'rgba(255, 107, 53, 0.35)',
      backgroundColor: 'rgba(255, 107, 53, 0.12)',
      shadowColor: 'rgba(255, 69, 0, 0.4)',
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 14,
      shadowOpacity: 1,
      elevation: 6,
    },
    iconContainer: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 107, 53, 0.4)',
      backgroundColor: 'rgba(255, 107, 53, 0.15)',
    },
  },

  wrath: {
    card: {
      borderRadius: 1,
      borderWidth: 1,
      borderLeftWidth: 5,
      borderColor: 'rgba(100, 0, 0, 0.45)',
      borderLeftColor: 'rgba(186, 24, 27, 0.85)',
      backgroundColor: 'rgba(186, 24, 27, 0.12)',
      shadowColor: '#ba181b',
      shadowOffset: { width: -4, height: 4 },
      shadowRadius: 10,
      shadowOpacity: 0.7,
      elevation: 6,
    },
    iconContainer: {
      borderRadius: 1,
      borderWidth: 1,
      borderColor: 'rgba(186, 24, 27, 0.4)',
      backgroundColor: 'rgba(186, 24, 27, 0.15)',
    },
  },
};

export function useFeatureCardTheme() {
  const { activeTheme } = useTheme();
  const ThemeFeatureCardStyles = themeFeatureCardStyles[activeTheme] ?? themeFeatureCardStyles.aspire;
  return { ThemeFeatureCardStyles };
}