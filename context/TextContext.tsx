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
    header:{
    backgroundColor: 'rgba(10, 20, 12, 0.35)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    color: {
        color: '#7EC8A0',
    },
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
    header: {
      backgroundColor: 'rgba(224, 247, 250, 0.2)', 
      borderBottomWidth: 1.5,
      borderBottomColor: 'rgba(255, 255, 255, 0.3)', 
    },
    color: {
      color: '#00CED1', 
    },
    title: {
      color: '#008B8B', 
      fontFamily: 'PlaywriteGBS_400Regular', 
      fontSize: 22,
      letterSpacing: 0,
      textShadowColor: 'rgba(255, 255, 255, 0.8)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    description: {
      color: 'rgba(0, 50, 60, 0.75)', 
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'serif',
      fontStyle: 'italic',
    },
    badge: {
      color: '#008B8B',
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 2,
      textTransform: 'uppercase',
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
    header: {
      backgroundColor: 'rgba(255, 240, 245, 0.3)', 
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(232, 160, 180, 0.2)',
    },
    title: {
      color: '#C2185B',
      fontFamily: 'DancingScript_600SemiBold',
      fontSize: 26,
    },
    description: {
      color: 'rgba(136, 14, 79, 0.8)', 
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'serif',
      fontStyle: 'italic',
    },
    badge: {
      color: '#C2185B',
      fontSize: 10,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
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
    header: {
      backgroundColor: 'rgba(255, 253, 231, 0.3)', // Warm morning mist
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 209, 102, 0.3)',
    },
    title: {
      color: '#F57C00', // Energetic Orange
      fontFamily: 'Fredoka_600SemiBold',
      fontSize: 24,
    },
    description: {
      color: 'rgba(94, 44, 0, 0.85)', // Deep Earthy Brown for maximum legibility on yellow
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'sans-serif',
      fontWeight: '500',
    },
    badge: {
      color: '#F57C00',
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
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
    header: {
      backgroundColor: 'rgba(10, 10, 15, 0.7)', 
      borderBottomWidth: 1,
      borderBottomColor: '#333',
    },
    title: {
      color: '#E0E0E0', 
      fontFamily: 'MedievalSharp_400Regular',
      fontSize: 26,
    },
    description: {
      color: '#9E9E9E',
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'serif', 
      fontStyle: 'italic',
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