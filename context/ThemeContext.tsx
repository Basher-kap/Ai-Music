// context/ThemeContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';
import { ThemeKey } from '@/constant/themes';  // ← import, don't redefine

type ThemeContextType = {
  activeTheme: ThemeKey;       
  setActiveTheme: (theme: ThemeKey) => void;  // called when a card is pressed
  // example: if love is pressed, setActiveTheme('love') is called, which updates activeTheme to 'love'
};

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: 'nostalgia',
  setActiveTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  //the useState hook where the ThemeKeys actually live when pressed
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('nostalgia'); // as for now the default theme is nostalgia

  //the provider that wraps the app and makes the theme object available to any child component that calls the useTheme() hook. 
  //When a card is pressed, setActiveTheme is called with the corresponding theme key, which updates the activeTheme state and triggers a re-render of any components consuming this context, allowing them to reflect the new theme immediately.
  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children} 
    </ThemeContext.Provider>
  );
}

//you use this to call the context in the other file/page
export const useTheme = () => useContext(ThemeContext);