// context/BgImgContext.tsx


import { ImageSourcePropType } from 'react-native';
import { useTheme, ThemeKey } from './ThemeContext'; 

export const themeImages: Record<ThemeKey, ImageSourcePropType> = {
  nostalgia: require('../assets/bg-images/nostalgia_theme2.jpg'),
  refreshing: require('../assets/bg-images/refreshing_theme.jpg'),
  love: require('../assets/bg-images/love_theme.png'),
  cheerful: require('../assets/bg-images/cheerful_theme2.jpg'),
  emo: require('../assets/bg-images/emos_theme.jpg'),
  aspire: require('../assets/bg-images/aspire_theme.jpg'),
  determination: require('../assets/bg-images/determination_theme.jpg'),
  wrath: require('../assets/bg-images/wrath_theme.png'),
};

export function useBgImg() : ImageSourcePropType {
  const { activeTheme } = useTheme(); // supposed activeTheme is 'love', then themeImages[activeTheme] will return require('../assets/bg-images/love_theme.png')
  return themeImages[activeTheme];
}