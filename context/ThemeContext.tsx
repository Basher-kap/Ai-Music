// context/ThemeContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

export type ThemeKey = 'nostalgia' | 'refreshing' | 'love' | 'cheerful' | 'emo' | 'determination' | 'wrath';

type ThemeContextType = {
  activeTheme: ThemeKey | null;       // currently selected theme
  setActiveTheme: (theme: ThemeKey) => void;  // called when a card is pressed
};

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: null,
  setActiveTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeKey | null>(null);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);