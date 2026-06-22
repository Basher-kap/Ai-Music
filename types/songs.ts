// types/songs.ts
export type Song = {
  id: string;
  title: string;
  artist: string;
  mp4song?: string;
  lyrics?: string;
  review?: string;
  song_theme: string[];
  user_id?: string;       // add if missing
  pending?: boolean;      // add for local-only songs
  localUri?: string;      // add for offline audio
};