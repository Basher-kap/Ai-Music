// context/TextContext.tsx
import { ThemeKey, useTheme } from './ThemeContext';
import { TextStyle } from 'react-native';

interface ThemeTextStyle {
  appTitle: TextStyle;
  tagline: TextStyle;
  description?: TextStyle;  // only some themes define this
  emptyTitle: TextStyle;
  emptySubtitle: TextStyle
}

export const themeTextStyles: Record<ThemeKey, ThemeTextStyle> = {
  nostalgia: {
    appTitle: {
      fontFamily: 'Marcellus_400Regular',
      fontSize: 50,
      letterSpacing: 4,
      color: '#e5f2e3',
      textShadowColor: 'rgba(27, 48, 34, 0.8)', 
      textShadowOffset: { width: 0, height: 4 },
      textShadowRadius: 20,
      opacity: 0.95,
      transform: [{ rotate: '-1deg' }],
    },
    tagline: {
      fontFamily: 'Marcellus_400Regular',
      fontSize: 20,
      color: '#e5f2e3',
      textShadowColor: 'rgba(27, 48, 34, 0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
    },
    emptyTitle: {
      fontFamily: 'Marcellus_400Regular',
      fontSize: 20,
      color: '#c8ecd4',
      textShadowColor: 'rgba(27, 48, 34, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    emptySubtitle: {
      fontFamily: 'Marcellus_400Regular',
      fontSize: 13,
    },
  },
  refreshing: {
    appTitle: {
      fontFamily: 'PlaywriteGBS_400Regular',
      fontSize: 40, 
      letterSpacing: 4, 
      color: '#F0FDFF', 
      textShadowColor: 'rgba(38, 222, 225, 0.82)', 
      textShadowOffset: { width: 0, height: 0 }, 
      textShadowRadius: 30,
      opacity: 1,
    },
    tagline: {
      fontFamily: 'PlaywriteGBS_400Regular',
      fontSize: 16,
      color: '#F0FDFF',
      textShadowColor: 'rgba(38, 222, 225, 0.82)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
    },   
    emptyTitle: {
      fontFamily: 'PlaywriteGBS_400Regular',
      fontSize: 18,
      color: '#d0f8ff',
      textShadowColor: 'rgba(38, 222, 225, 0.6)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
    emptySubtitle: {
      fontFamily: 'PlaywriteGBS_400Regular',
      fontSize: 12,
    },
  },
  love: {
    appTitle: {
      fontFamily: 'DancingScript_600SemiBold',
      fontSize: 55,
      color: '#FFFFFF', 
      textShadowColor: 'rgba(232, 160, 180, 0.8)', 
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 15,
      letterSpacing: 2,
    },
    tagline: {
      fontFamily: 'DancingScript_600SemiBold',
      fontSize: 20,
      color: '#FFFFFF',
      textShadowColor: 'rgba(232, 160, 180, 0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
    },
    emptyTitle: {
      fontFamily: 'DancingScript_600SemiBold',
      fontSize: 22,
      color: '#ffcce0',
      textShadowColor: 'rgba(232, 160, 180, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    emptySubtitle: {
      fontFamily: 'DancingScript_600SemiBold',
      fontSize: 14,
    },
  },
  cheerful: {
    appTitle: {
      fontFamily: 'Fredoka_600SemiBold',
      fontSize: 50,
      color: '#FFFFFF', 
      textShadowColor: 'rgba(255, 160, 0, 0.8)', // Warm Solar Glow
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
      letterSpacing: 4,
    },
    tagline: {
      fontFamily: 'Fredoka_600SemiBold',
      fontSize: 20,
      color: '#FFFFFF',
      textShadowColor: 'rgba(255, 160, 0, 0.8)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
    },
    emptyTitle: {
      fontFamily: 'Fredoka_600SemiBold',
      fontSize: 22,
      color: '#fff3b0',
      textShadowColor: 'rgba(255, 160, 0, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    emptySubtitle: {
      fontFamily: 'Fredoka_600SemiBold',
      fontSize: 14,
    },
  },
  emo: {
    appTitle: {
      fontFamily: 'MedievalSharp_400Regular',
      fontSize: 50,
      letterSpacing: 2,
      color: '#BDBDBD', 
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
    },
    tagline: {
      fontFamily: 'MedievalSharp_400Regular',
      fontSize: 16,
      color: '#BDBDBD',
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
    },
    emptyTitle: {
      fontFamily: 'MedievalSharp_400Regular',
      fontSize: 18,
      color: '#9e9e9e',
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 4,
    },
    emptySubtitle: {
      fontFamily: 'MedievalSharp_400Regular',
      fontSize: 12,
    },
  },
  aspire: {
    appTitle: {
      fontFamily: 'Syne_700Bold', 
      fontSize: 50,
      color: '#FFFFFF',
      letterSpacing: -1.5, 
      textAlign: 'center',
      
      textShadowColor: 'rgba(176, 106, 179, 0.85)', 
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 18, 
    },
    tagline: {
      fontFamily: 'Syne_700Bold',
      fontSize: 16,
      color: '#FFFFFF',
      textShadowColor: 'rgba(176, 106, 179, 0.85)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 18,
    },
    emptyTitle: {
      fontFamily: 'Syne_700Bold',
      fontSize: 20,
      color: '#d0eeff',
      textShadowColor: 'rgba(176, 106, 179, 0.7)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 12,
    },
    emptySubtitle: {
      fontFamily: 'Syne_700Bold',
      fontSize: 13,
    },
  },
  determination: { 
    appTitle: {
    fontFamily: 'RussoOne_400Regular',
    fontSize: 48,
    color: '#eddad4',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(240, 101, 46, 0.82)', 
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 15,
   },
    tagline: {
      fontFamily: 'RussoOne_400Regular',
      fontSize: 14,
      color: '#eddad4',
      textShadowColor: 'rgba(240, 101, 46, 0.82)',
      textShadowOffset: { width: 3, height: 4 },
      textShadowRadius: 15,
    },
    emptyTitle: {
      fontFamily: 'RussoOne_400Regular',
      fontSize: 20,
      color: '#eddad4',
      textShadowColor: 'rgba(240, 101, 46, 0.7)',
      textShadowOffset: { width: 2, height: 3 },
      textShadowRadius: 8,
    },
    emptySubtitle: {
      fontFamily: 'RussoOne_400Regular',
      fontSize: 12,
    },
  },
  wrath: { 
    appTitle: {
      fontFamily: 'MetalMania_400Regular',
      fontSize: 55,
      color: '#d72727ad', 
      textAlign: 'center',
      letterSpacing: 4,
      textShadowColor: 'rgba(20, 3, 3, 0.9)', 
      textShadowOffset: { width: 3, height: 5 },
      textShadowRadius: 1,
    }, 
    tagline: {
      fontFamily: 'MetalMania_400Regular',
      fontSize: 19,
      color: '#d72727ad',
      textShadowColor: 'rgba(20, 3, 3, 0.9)',
      textShadowOffset: { width: 3, height: 1 },
      textShadowRadius: 1,
    },
    emptyTitle: {
      fontFamily: 'MetalMania_400Regular',
      fontSize: 22,
      color: '#cc2222',
      textShadowColor: 'rgba(20, 3, 3, 0.9)',
      textShadowOffset: { width: 2, height: 3 },
      textShadowRadius: 4,
    },
    emptySubtitle: {
      fontFamily: 'MetalMania_400Regular',
      fontSize: 13,
    },
  },
};

export function useTextTheme() : { ThemeTextStyles: ThemeTextStyle } {
  const { activeTheme } = useTheme();
  const ThemeTextStyles = themeTextStyles[activeTheme];
  return { ThemeTextStyles };
}