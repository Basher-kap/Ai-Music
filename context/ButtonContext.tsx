// context/ButtonContext.tsx
import { ThemeKey, useTheme } from './ThemeContext';
import { ViewStyle } from 'react-native';

interface ThemeButtonStyle {
  addButton: ViewStyle;
  addButtonLong: ViewStyle;
}

export const themeButtonStyles: Record<ThemeKey, ThemeButtonStyle> = {
  nostalgia: {
    addButton: {
      borderRadius: 14,
      borderColor: '#8ee8b4',
      borderWidth: 1.5,
      shadowColor: 'rgba(126, 200, 160, 0.6)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 20,
      shadowOpacity: 1,
      elevation: 8,
    },
    addButtonLong: {
      borderRadius: 20,
    }
  },

  refreshing: {
    addButton: {
      borderRadius: 99, 
      borderColor: 'rgba(224, 250, 255, 0.11)', 
      borderWidth: 1.5,
      shadowColor: 'rgba(92, 225, 230, 0.4)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 40, 
      shadowOpacity: 1,
      elevation: 6,
    },
    addButtonLong:{
      borderRadius: 15, 
      borderColor: 'rgba(170, 224, 234, 0.69)', 
      borderWidth: 1.5,
    }
  },

  love: {
    addButton: {
      borderTopLeftRadius: 29,
      borderTopRightRadius: 29,
      borderBottomRightRadius: 29,
      borderBottomLeftRadius: 5,
      borderColor: '#fff0f6', 
      borderWidth: 2,
      shadowColor: 'rgba(255, 96, 144, 0.4)', 
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 36,
      shadowOpacity: 1,
      elevation: 10,
    },
    addButtonLong:{
      borderTopLeftRadius: 29,
      borderTopRightRadius: 29,
      borderBottomRightRadius: 29,
      borderBottomLeftRadius: 5,
      borderColor: '#fff0f6', 
      borderWidth: 2,
    }
  },

  cheerful: {
    addButton: {
      borderRadius: 10,
      borderColor: '#fff176',
      borderWidth: 2,
      shadowColor: 'rgba(255, 220, 50, 0.85)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 32,
      shadowOpacity: 1,
      elevation: 12,
    },
    addButtonLong: {
      borderRadius: 10,
      borderColor: '#fff176',
      borderWidth: 2,
    }
  },

  emo: {
    addButton: {
      borderRadius: 4,
      borderColor: '#484848',
      borderWidth: 1,
      backgroundColor: 'transparent', 
      shadowColor: 'rgba(0, 0, 0, 0.9)',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 14,
      shadowOpacity: 1,
      elevation: 4,
    },
    addButtonLong: {
      borderRadius: 4,
      borderColor: '#484848',
      borderWidth: 1,
      backgroundColor: 'transparent',
    }
  },

  aspire: {
    addButton: {
        borderRadius: 99, 
        borderColor: '#a0f0ff', 
        borderWidth: 1.5,
        shadowColor: '#00d2ff', 
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 26,
        shadowOpacity: 0.85,
        elevation: 12,
    },
    addButtonLong:{
      borderRadius: 30, 
        borderColor: '#a0f1ff1e', 
        borderWidth: 1.5,
        shadowColor: '#00d2ff', 
    }
  },

  determination: {
    addButton: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      borderColor: '#ff9060',
      borderWidth: 1.5,
      borderTopWidth: 2.5,
      shadowColor: 'rgba(255, 107, 53, 0.65)',
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 22,
      shadowOpacity: 1,
      elevation: 10,
    },
    addButtonLong: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      borderColor: '#ff9060',
      borderWidth: 1.5,
      borderTopWidth: 2.5,
    }
  },

  wrath: {
    addButton: {
      borderRadius: 0,
      borderColor: '#8b0000',
      borderWidth: 1,
      borderLeftWidth: 1,
      shadowColor: 'rgba(180, 0, 0, 0.6)',
      shadowOffset: { width: 4, height: 0 },
      shadowRadius: 24,
      shadowOpacity: 1,
      elevation: 10,
    },
    addButtonLong: {
      borderRadius: 0,
      borderColor: '#8b0000',
      borderWidth: 1,
      borderLeftWidth: 1,
    }
  },
};

export const ADD_BUTTON_GRADIENTS: Record<ThemeKey, [string, string, ...string[]]> = {
  nostalgia:     ['#3a7a52', '#5ab07a'],
  refreshing:    [
    'rgba(48, 181, 255, 0.70)',   
    'rgba(92, 225, 230, 0.35)',   
    'rgba(196, 250, 252, 0.57)'   
  ],
  love:          ['#ff3377', '#ff8ebb', '#ff5599'],   
  cheerful:      ['#ffaa00', '#ffe000', '#ffcc00'], 
  emo:           ['#1a1a1a', '#2e2e2e'],
  aspire:        ['#0b0926', '#13409b', '#00bcd4', '#00e5ff', '#ffffff'],  determination: ['#c03000', '#ff5500'],
  wrath:         ['#1a0000', '#3d0000'],
};

export function useButtonTheme() {
  const { activeTheme } = useTheme();
  const ThemeButtonStyles = themeButtonStyles[activeTheme] ?? themeButtonStyles.aspire;
  return { ThemeButtonStyles, activeTheme };
}