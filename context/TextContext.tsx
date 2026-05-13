// context/TextContext.tsx

import { useContext } from "react";
import { useBgImgTheme } from "./BgImgContext";

type ThemeKey = 'nostalgia' | 'refreshing' | 'love' | 'cheerful' | 'emo' | 'determination' | 'wrath';

export const themeTextColors: Record<ThemeKey, string> = {
  nostalgia: '#90EE90',       // soft green
  refreshing: '#87CEEB',      // sky blue
  love: '#FFB6C1',            // light pink
  cheerful: '#FFD700',        // sunny yellow
  emo: '#9B59B6',             // muted violet
  determination: '#FF4500',   // fiery orange
  wrath: '#FF0000',           // blood red
};

const defaultTextColor = '#FFFFFF'; // default to white

export function useTextTheme() {
  const { activeTheme } = useBgImgTheme(); // reads from existing context

  const textColor = activeTheme ? themeTextColors[activeTheme] : defaultTextColor;

  return { textColor };
}
