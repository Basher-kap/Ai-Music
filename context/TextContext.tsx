// context/TextContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';


export const themeTextStyles: Record<ThemeKey, any> = {
  nostalgia: {
    appTitle: {
      fontFamily: 'Marcellus_400Regular',
      fontSize: 45,
      letterSpacing: 4,
      color: '#E8F5E9',
      textShadowColor: 'rgba(18, 45, 12, 0.95)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 2,
      opacity: 0.98,
      transform: [{ scaleX: 1.08 }],
    },
    header:{
      // atmospheric dark overlay
    backgroundColor: 'rgba(10, 20, 12, 0.35)',
    // soft separation from background image
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
  refreshing:    { title: {}, description: {} },
  love:          { // context/TextContext.tsx

  love: {
    appTitle: {
      fontFamily: 'PlaywriteITModerna_400Regular',
      fontSize: 36,
      color: '#FFF5F7', // Near-white pink
      letterSpacing: 1,
      textShadowColor: 'rgba(232, 160, 180, 0.8)', // Soft Petal Pink glow
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 12,
    },
    header: {
      backgroundColor: 'rgba(255, 240, 245, 0.25)', // Blushed mist
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(232, 160, 180, 0.3)',
    },
    color: {
      color: '#E8A0B4', // Main Love Pink
    },
    title: {
      color: '#D87093', // Pale Violet Red for readability
      fontFamily: 'PlaywriteITModerna_400Regular',
      fontSize: 22,
      textShadowColor: 'rgba(255, 255, 255, 0.9)',
      textShadowRadius: 5,
    },
    description: {
      color: 'rgba(100, 50, 60, 0.7)', // Warm cocoa-tinted text
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'serif',
      fontStyle: 'italic',
    },
    badge: {
      color: '#D87093',
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 2,
    },
  },
},
  cheerful:      { title: {}, description: {} },
  emo:           { title: {}, description: {} },
  aspire:      { title: {}, description: {} },
  determination: { title: {}, description: {} },
  wrath:         { title: {}, description: {} },
};

export function useTextTheme() {
  const { activeTheme } = useTheme();
  const ThemeTextStyles = themeTextStyles[activeTheme];
  return { ThemeTextStyles };
}