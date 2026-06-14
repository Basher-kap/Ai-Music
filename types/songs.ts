// types/songs.ts
export type Song = {
  id: string;
  title: string;
  artist: string;
  mp4song?: string;
  localUri?: string;   // local file path for offline playback
  lyrics?: string;
  review?: string;
  song_theme: string[];
  user_id?: string;
  pending?: boolean;   //  true if not yet synced to Supabase
};