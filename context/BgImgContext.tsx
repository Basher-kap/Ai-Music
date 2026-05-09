// context/BgImgContext.tsx

import { createContext, useState, ReactNode, useContext } from 'react';

type BgImgThemeKey = 'nostalgia' | 'love' | 'cheerful' | 'emo' | 'determination' | 'wrath';

export const themeImages: Record<BgImgThemeKey, any> = {
  nostalgia: require('../assets/bg-images/nostalgia_theme2.jpg'),
  love: require('../assets/bg-images/love_theme2.jpg'),
  cheerful: require('../assets/bg-images/cheerful_theme2.jpg'),
  emo: require('../assets/bg-images/emos_theme2.jpg'),
  determination: require('../assets/bg-images/determination_theme.jpg'),
  wrath: require('../assets/bg-images/wrath_theme4.jpg'),
};

type BgImgContextType = {
    activeTheme: BgImgThemeKey  | null;
    setActiveTheme: (theme: BgImgThemeKey) => void;
};

const BgImgContext = createContext<BgImgContextType>({
    activeTheme: null,
    setActiveTheme: () => {},
});

export function BgImgThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<BgImgThemeKey | null>(null);

  return (
    <BgImgContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </BgImgContext.Provider>
  );
}

export const useBgImgTheme = () => useContext(BgImgContext);
