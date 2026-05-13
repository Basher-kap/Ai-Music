// context/BgImgContext.tsx

import { useTheme, ThemeKey } from './ThemeContext'; 

export const themeImages: Record<ThemeKey, any> = {
  nostalgia: require('../assets/bg-images/nostalgia_theme2.jpg'),
  refreshing: require('../assets/bg-images/refreshing_theme.jpg'),
  love: require('../assets/bg-images/love_theme.png'),
  cheerful: require('../assets/bg-images/cheerful_theme2.jpg'),
  emo: require('../assets/bg-images/emos_theme.jpg'),
  determination: require('../assets/bg-images/determination_theme.jpg'),
  wrath: require('../assets/bg-images/wrath_theme.png'),
};

const defaultImage = require('../assets/bg-images/nostalgia_theme4.jpg');

export function useBgImg() {
  const { activeTheme } = useTheme(); // ← borrows from ThemeContext
  return activeTheme ? themeImages[activeTheme] : defaultImage;
}