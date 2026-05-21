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
  aspire:      { title: {}, description: {} },
  determination: { title: {}, description: {} },
  wrath:         { title: {}, description: {} },
};

export function useTextTheme() {
  const { activeTheme } = useTheme();
  const ThemeTextStyles = themeTextStyles[activeTheme];
  return { ThemeTextStyles };
}