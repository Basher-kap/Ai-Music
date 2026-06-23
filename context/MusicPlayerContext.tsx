// context/MusicPlayerContext.tsx
import { useTheme, ThemeKey } from './ThemeContext';
import { ViewStyle, TextStyle } from 'react-native';

interface ThemeMusicPlayerStyle {
  container: ViewStyle;
  track: ViewStyle;
  progressFill: ViewStyle;
  progressThumb: ViewStyle;
  timeText: TextStyle;
  skipBtn: ViewStyle;
  skipIconColor: string;
  playBtn: ViewStyle;
  playIconColor: string;
}

const themeMusicPlayerStyles: Record<ThemeKey, ThemeMusicPlayerStyle> = {
  nostalgia: {
    container: {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 18,
      borderWidth: 1.5,
      borderColor: '#8ee8b4',
      borderLeftWidth: 4,
      borderLeftColor: '#3a7a52',
      backgroundColor: 'rgba(242, 252, 246, 0.45)', // Nostalgia soft green glass
      shadowColor: 'rgba(126, 200, 160, 0.6)',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 20,
      shadowOpacity: 1,
      elevation: 6,
    },
    track: {
      backgroundColor: 'rgba(90, 176, 122, 0.18)',
      borderRadius: 2,
    },
    progressFill: {
      backgroundColor: '#5ab07a',
      borderRadius: 2,
    },
    progressThumb: {
      backgroundColor: '#3a7a52',
      borderRadius: 6,
      width: 12,
      height: 12,
    },
    timeText: {
      color: '#3a7a52',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(242, 252, 246, 0.8)',
      borderWidth: 1,
      borderColor: 'rgba(90, 176, 122, 0.4)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: '#3a7a52',
    playBtn: {
      backgroundColor: '#3a7a52',
      borderRadius: 10,
    },
    playIconColor: '#ffffff',
  },

  refreshing: {
    container: {
      borderRadius: 99,
      borderWidth: 1.5,
      borderColor: '#a0f0f5',
      borderRightWidth: 4,
      borderRightColor: '#00bfff',
      backgroundColor: 'rgba(240, 250, 255, 0.4)',  // Refreshing sea and sky glass
      shadowColor: '#00d2ff',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 18,
      shadowOpacity: 0.6,
      elevation: 6,
    },
    track: {
      backgroundColor: 'rgba(0, 191, 255, 0.18)',
      borderRadius: 99,
    },
    progressFill: {
      backgroundColor: '#00bfff',
      borderRadius: 99,
    },
    progressThumb: {
      backgroundColor: '#007ca8',
      borderRadius: 99,
      width: 12,
      height: 12,
    },
    timeText: {
      color: '#007ca8',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(240, 250, 255, 0.8)',
      borderWidth: 1,
      borderColor: 'rgba(0, 191, 255, 0.4)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 99,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: '#007ca8',
    playBtn: {
      backgroundColor: '#00bfff',
      borderRadius: 99,
    },
    playIconColor: '#ffffff',
  },

  love: {
    container: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      borderBottomRightRadius: 18,
      borderBottomLeftRadius: 4,
      borderWidth: 1.5,
      borderColor: '#ffccd5',
      borderBottomWidth: 4,
      borderBottomColor: '#ff8fab',
      backgroundColor: 'rgba(255, 245, 247, 0.45)', // Love soft cherry glass
      shadowColor: '#ffb3c1',
      shadowOffset: { width: 3, height: 3 },
      shadowRadius: 0,
      shadowOpacity: 0.6,
      elevation: 7,
    },
    track: {
      backgroundColor: 'rgba(255, 143, 171, 0.18)',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 2,
    },
    progressFill: {
      backgroundColor: '#ff8fab',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 2,
    },
    progressThumb: {
      backgroundColor: '#c9184a',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 2,
      width: 12,
      height: 12,
    },
    timeText: {
      color: '#ff4d6d',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(255, 245, 247, 0.85)',
      borderWidth: 1,
      borderColor: 'rgba(255, 143, 171, 0.5)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: '#ff4d6d',
    playBtn: {
      backgroundColor: '#ff8fab',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderBottomLeftRadius: 4,
    },
    playIconColor: '#ffffff',
  },

  cheerful: {
    container: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ffe066',
      borderBottomWidth: 4,
      borderBottomColor: '#f5a623',
      backgroundColor: 'rgba(255, 253, 240, 0.45)', // Cheerful radiant solar glass
      shadowColor: '#f5a623',
      shadowOffset: { width: 5, height: 4 },
      shadowRadius: 0,
      shadowOpacity: 0.5,
      elevation: 7,
    },
    track: {
      backgroundColor: 'rgba(255, 208, 0, 0.18)',
      borderRadius: 2,
    },
    progressFill: {
      backgroundColor: '#ffd000',
      borderRadius: 2,
    },
    progressThumb: {
      backgroundColor: '#b26a00',
      borderRadius: 3,
      width: 12,
      height: 12,
    },
    timeText: {
      color: '#d48800',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(255, 253, 240, 0.85)',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 208, 0, 0.5)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: '#d48800',
    playBtn: {
      backgroundColor: '#f5a623',
      borderRadius: 8,
    },
    playIconColor: '#ffffff',
  },

  emo: {
    container: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#101428',
      borderLeftWidth: 5,
      borderLeftColor: '#4895ef',
      backgroundColor: 'rgba(3, 4, 14, 0.94)',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      shadowOpacity: 0.8,
      elevation: 6,
    },
    track: {
      backgroundColor: 'rgba(72, 149, 239, 0.15)',
      borderRadius: 2,
    },
    progressFill: {
      backgroundColor: '#4895ef',
      borderRadius: 2,
    },
    progressThumb: {
      backgroundColor: '#4895ef',
      borderRadius: 2,
      width: 12,
      height: 12,
    },
    timeText: {
      color: 'rgba(120, 149, 220, 0.5)',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(5, 6, 18, 0.9)',
      borderWidth: 1,
      borderColor: 'rgba(72, 149, 239, 0.25)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: 'rgba(120, 149, 220, 0.85)',
    playBtn: {
      backgroundColor: '#4895ef',
      borderRadius: 4,
    },
    playIconColor: '#ffffff',
  },

  aspire: {
    container: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 4,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(150, 80, 255, 0.5)',
      backgroundColor: 'rgba(8, 2, 22, 0.92)',
      shadowColor: '#7b2ff7',
      shadowOffset: { width: 0, height: -4 },
      shadowRadius: 18,
      shadowOpacity: 0.65,
      elevation: 7,
    },
    track: {
      backgroundColor: 'rgba(150, 80, 255, 0.18)',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 2,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 8,
    },
    progressFill: {
      backgroundColor: '#7b2ff7',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 2,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 8,
    },
    progressThumb: {
      backgroundColor: '#c77dff',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 2,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 8,
      width: 12,
      height: 12,
    },
    timeText: {
      color: 'rgba(180, 130, 255, 0.55)',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(20, 5, 50, 0.88)',
      borderWidth: 1,
      borderColor: 'rgba(150, 80, 255, 0.35)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 3,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: 'rgba(180, 130, 255, 0.85)',
    playBtn: {
      backgroundColor: '#7b2ff7',
      borderTopLeftRadius: 14,
      borderTopRightRadius: 3,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 14,
    },
    playIconColor: '#ffffff',
  },

  determination: {
    container: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderWidth: 1,
      borderTopWidth: 3,
      borderTopColor: '#ff5500',
      borderColor: 'rgba(58, 13, 0, 0.7)',
      backgroundColor: 'rgba(10, 3, 0, 0.92)',
      shadowColor: '#ff4500',
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 18,
      shadowOpacity: 0.45,
      elevation: 7,
    },
    track: {
      backgroundColor: 'rgba(255, 107, 53, 0.18)',
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    progressFill: {
      backgroundColor: '#ff5500',
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    progressThumb: {
      backgroundColor: '#ff6b35',
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      width: 12,
      height: 12,
    },
    timeText: {
      color: 'rgba(255, 140, 80, 0.55)',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(35, 10, 0, 0.88)',
      borderWidth: 1,
      borderColor: 'rgba(255, 107, 53, 0.35)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 14,
      borderBottomRightRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: 'rgba(255, 140, 80, 0.85)',
    playBtn: {
      backgroundColor: '#ff5500',
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
    },
    playIconColor: '#000000',
  },

  wrath: {
    container: {
      borderRadius: 1,
      borderWidth: 1,
      borderLeftWidth: 6,
      borderColor: 'rgba(43, 0, 0, 0.6)',
      borderLeftColor: '#660708',
      backgroundColor: 'rgba(8, 0, 0, 0.94)',
      shadowColor: '#ba181b',
      shadowOffset: { width: -5, height: 5 },
      shadowRadius: 14,
      shadowOpacity: 0.85,
      elevation: 7,
    },
    track: {
      backgroundColor: 'rgba(186, 24, 27, 0.18)',
      borderRadius: 1,
    },
    progressFill: {
      backgroundColor: '#8b0000',
      borderRadius: 1,
    },
    progressThumb: {
      backgroundColor: '#cc0000',
      borderRadius: 1,
      width: 12,
      height: 12,
    },
    timeText: {
      color: 'rgba(200, 80, 80, 0.55)',
      fontSize: 10,
      width: 32,
    },
    skipBtn: {
      backgroundColor: 'rgba(12, 0, 0, 0.9)',
      borderWidth: 1,
      borderColor: 'rgba(100, 0, 0, 0.5)',
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    skipIconColor: 'rgba(200, 80, 80, 0.85)',
    playBtn: {
      backgroundColor: '#8b0000',
      borderRadius: 1,
    },
    playIconColor: '#ffffff',
  },
};

export function useMusicPlayerTheme() {
  const { activeTheme } = useTheme();
  const ThemeMusicPlayerStyles = themeMusicPlayerStyles[activeTheme] ?? themeMusicPlayerStyles.aspire;
  return { ThemeMusicPlayerStyles };
}