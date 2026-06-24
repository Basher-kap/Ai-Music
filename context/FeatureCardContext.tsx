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
      borderWidth: 1.5,
      borderColor: '#8ee8b4',
      borderLeftWidth: 4,
      borderLeftColor: '#3a7a52',
      backgroundColor: '#11261a',            // Deep forest night base
      shadowColor: 'rgba(126, 200, 160, 0.6)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 20,
      shadowOpacity: 1,
      elevation: 4,
    },
    iconContainer: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#5ab07a',
      backgroundColor: 'rgba(90, 176, 122, 0.15)',
    },
  },

  refreshing: {
    card: {
      borderRadius: 99,
      borderWidth: 1,
      borderColor: '#a0f0f5',
      borderRightWidth: 3,
      borderRightColor: '#00bfff',
      backgroundColor: '#051b26',            // Dark midnight-ocean void
      shadowColor: '#00d2ff',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 14,
      shadowOpacity: 1,
      elevation: 4,
    },
    iconContainer: {
      borderRadius: 99,
      borderWidth: 1,
      borderColor: '#7cdcf5',
      backgroundColor: 'rgba(0, 191, 255, 0.15)',
    },
  },

  love: {
    card: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: '#ffccd5',
      borderBottomColor: '#ff8fab',
      backgroundColor: '#240a10',            // Luxurious deep berry shadow
      shadowColor: '#ffb3c1',
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
      borderColor: '#ff8fab',
      backgroundColor: 'rgba(255, 143, 171, 0.15)',
    },
  },

  cheerful: {
    card: {
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: '#ffe066',
      borderBottomWidth: 2.5,
      borderBottomColor: '#f5a623',
      backgroundColor: '#1c1702',            // Deep pitch-amber obsidian
      shadowColor: '#f5a623',
      shadowOffset: { width: 5, height: 4 },
      shadowRadius: 0,
      shadowOpacity: 1,
      elevation: 5,
    },
    iconContainer: {
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: '#ffd000',
      backgroundColor: 'rgba(255, 208, 0, 0.15)',
    },
  },

  emo: {
    card: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(72, 149, 239, 0.4)',
      borderLeftWidth: 4,
      borderLeftColor: '#4895ef',
      backgroundColor: '#040814',            // Extreme dark cyber void
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      shadowOpacity: 0.8,
      elevation: 5,
    },
    iconContainer: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#4895ef',
      backgroundColor: 'rgba(72, 149, 239, 0.15)',
    },
  },

  aspire: {
    card: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 4,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(150, 80, 255, 0.5)',
      backgroundColor: 'rgba(10, 3, 20, 0.45)',   // Transparent arcane purple glass
      shadowColor: '#7b2ff7',
      shadowOffset: { width: 0, height: -3 },
      shadowRadius: 14,
      shadowOpacity: 0.6,
      elevation: 5,
    },
    iconContainer: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 3,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 12,
      borderWidth: 1,
      borderColor: '#7b2ff7',
      backgroundColor: 'rgba(150, 80, 255, 0.22)',
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
      borderColor: 'rgba(255, 107, 53, 0.4)',
      backgroundColor: '#140500',            // Burned cinder backplate
      shadowColor: '#ff4500',
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
      borderColor: '#ff5500',
      backgroundColor: 'rgba(255, 107, 53, 0.18)',
    },
  },

  wrath: {
    card: {
      borderRadius: 1,
      borderWidth: 1,
      borderLeftWidth: 5,
      borderColor: 'rgba(186, 24, 27, 0.5)',
      borderLeftColor: '#ba181b',
      backgroundColor: '#0f0102',            // Pure blood-crimson twilight tone
      shadowColor: '#ba181b',
      shadowOffset: { width: -4, height: 4 },
      shadowRadius: 10,
      shadowOpacity: 0.85,
      elevation: 6,
    },
    iconContainer: {
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#ba181b',
      backgroundColor: 'rgba(186, 24, 27, 0.2)',
    },
  },
};

export function useFeatureCardTheme() {
  const { activeTheme } = useTheme();
  const ThemeFeatureCardStyles = themeFeatureCardStyles[activeTheme] ?? themeFeatureCardStyles.aspire;
  return { ThemeFeatureCardStyles };
}