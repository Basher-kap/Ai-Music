// types/songs.ts

export type Song = {
  id: string;
  title: string;
  artist: string;
  mp4song?: string;
  lyrics?: string;
  review?: string;
  song_theme: string[];
};

