// context/TextContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';


export const themeTextStyles: Record<ThemeKey, any> = {
  nostalgia: {
    appTitle: {
      fontFamily: 'Marcellus_400Regular',
      fontSize: 48,
      bottom: '20' , //move a little higher
      letterSpacing: 4,
      color: '#E8F5E9',
      textShadowColor: 'rgba(18, 45, 12, 0.95)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 2,
      opacity: 0.98,
      transform: [{ scaleX: 1.08 }],
    },
  },
  refreshing: {
    appTitle: {
      fontFamily: 'PlaywriteGBS_400Regular',
      fontSize: 48, 
      bottom: '20' ,
      color: '#F0FDFF', 
      letterSpacing: 5, 
      textShadowColor: 'rgba(0, 206, 209, 0.6)', 
      textShadowOffset: { width: 0, height: 0 }, 
      textShadowRadius: 15,
      opacity: 1,
    },
  },
  love: {
    appTitle: {
      fontFamily: 'DancingScript_600SemiBold',
      bottom: '20' ,
      fontSize: 58,
      color: '#FFFFFF', 
      textShadowColor: 'rgba(232, 160, 180, 0.8)', 
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 15,
    },
  },
  cheerful: {
    appTitle: {
      fontFamily: 'Fredoka_600SemiBold',
      fontSize: 48,
      color: '#FFFFFF', 
      textShadowColor: 'rgba(255, 160, 0, 0.8)', // Warm Solar Glow
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 10,
      letterSpacing: 4,
    },
  },
  emo: {
    appTitle: {
      fontFamily: 'MedievalSharp_400Regular',
      fontSize: 46,
      color: '#BDBDBD', 
      textShadowColor: 'rgba(0, 0, 0, 0.9)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
    },
  },
  aspire: {
    appTitle: {
      fontFamily: 'Syne_700Bold', 
      fontSize: 43,
      color: '#FFFFFF',
      letterSpacing: -1.5, 
      textAlign: 'center',
      
      textShadowColor: 'rgba(176, 106, 179, 0.85)', 
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 18, 
    },
  },
  determination: { 
    appTitle: {
    fontFamily: 'RussoOne_400Regular',
    fontSize: 44,
    color: '#eddad4',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(240, 101, 46, 0.82)', 
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 15,
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
  },
};

export function useTextTheme() {
  const { activeTheme } = useTheme();
  const ThemeTextStyles = themeTextStyles[activeTheme];
  return { ThemeTextStyles };
}