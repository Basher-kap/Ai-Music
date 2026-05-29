// constant/themes.ts
import { ThemeKey } from '@/context/ThemeContext';

export type ThemeInfo = {
  key: ThemeKey;
  name: string;
  emoji: string;
  description: string;
  tagline: string;
};

export const THEMES: ThemeInfo[] = [
  {
    key: 'nostalgia',
    name: 'Nostalgia',
    emoji: '🌿',
    description: 'Atmospheric nature-tinted vibe filled with melancholy, healing, and dreamlike youth memories lingering away yet remains.',
    tagline: 'linger a little longer',
  },
  {
    key: 'refreshing',
    name: 'Refreshing',
    emoji: '🌊',
    description: "Light, airy, and uplifting mood that eases one's mind then taking a deep breath, evoking feelings of renewal, hope, and rejuvenation.",
    tagline: 'a breath of new life',
  },
  {
    key: 'love',
    name: 'Love',
    emoji: '🌸',
    description: "Story of unrequited feelings, first shiver of romance, and supporting of one's dear life.",
    tagline: 'my feelings for you will reach',
  },
  {
    key: 'cheerful',
    name: 'Cheerful',
    emoji: '☀️',
    description: 'Gives warm burst of joy and hope, a will to take another challenge, and embrace sunshine moments of happiness and fun.',
    tagline: 'smile for the another day',
  },
  {
    key: 'emo',
    name: 'Emo',
    emoji: '🖤',
    description: 'Descending, sinking deep to darkness of despair born from tragedies and unhealthy inner self shadows.',
    tagline: 'silently screaming in pain',
  },
  {
    key: 'aspire',
    name: 'Aspire',
    emoji: '🌌',
    description: 'Gaze into the stars, expanding galaxy, starry skies, and find the never-ending future of our life and this world.',
    tagline: 'universe is waiting for us',
  },
  {
    key: 'determination',
    name: 'Determination',
    emoji: '🔥',
    description: "Unwavering strong belief, hardened resolve — one's commitment to war.",
    tagline: 'desire for victory and never surrender',
  },
  {
    key: 'wrath',
    name: 'Wrath',
    emoji: '🩸',
    description: 'Aggressive motivation forged from anger turned to power, fueling rebellion and adapts to evil.',
    tagline: 'let the rage be unleashed',
  },
];

export const THEME_ACCENTS: Record<ThemeKey, string> = {
  nostalgia:     '#7EC8A0',
  refreshing:    '#7EC8E3',
  love:          '#E8A0B4',
  cheerful:      '#FFD166',
  emo:           '#525252',
  aspire:        '#6334ae',
  determination: '#FF6B35',
  wrath:         '#C0392B',
};

// keys only for AddSongForm theme chips
export const THEME_KEYS: ThemeKey[] = THEMES.map(t => t.key);