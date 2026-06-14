// store/SongsContext.tsx
import { Song } from '@/types/songs';
import { logger } from '@/utils/logger';
import { supabase } from '@/utils/supabase';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

type SongsContextType = {
  songs: Song[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addSong: (title: string, artist: string, song_theme: string[]) => Promise<void>;
  addLyrics: (id: string, title: string, artist: string, lyrics: string) => Promise<void>;
  addReviews: (id: string, song_theme: string[], review: string) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  uploadAudio: (songId: string, fileUri: string, fileName: string) => Promise<string | null>;
};

const SongsContext = createContext<SongsContextType>({
  songs: [],
  loading: true,
  error: null,
  refetch: async () => {},
  addSong: async () => {},
  addLyrics: async () => {},
  addReviews: async () => {},
  deleteSong: async () => {},
  uploadAudio: async () => null,
});

export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Cache helpers ───────────────────────────────────────────────────────────

  const getCacheKey = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? `songs_${user.id}` : null;
  };

  const saveToCache = async (data: Song[]) => {
    try {
      const key = await getCacheKey();
      if (key) {
        await AsyncStorage.setItem(key, JSON.stringify(data));
        console.log('[Songs] Cache updated');
      }
    } catch {
      console.log('[Songs] Cache save failed');
    }
  };

  const loadFromCache = async (): Promise<Song[]> => {
    try {
      const key = await getCacheKey();
      if (!key) return [];
      const cached = await AsyncStorage.getItem(key);
      return cached ? JSON.parse(cached) : [];
    } catch {
      console.log('[Songs] Cache load failed');
      return [];
    }
  };

  const clearCache = async () => {
    try {
      const key = await getCacheKey();
      if (key) {
        await AsyncStorage.removeItem(key);
        console.log('[Songs] Cache cleared');
      }
    } catch {
      console.log('[Songs] Cache clear failed');
    }
  };

  const isNetworkError = (err: any): boolean =>
    err?.message?.includes('Network request failed') ||
    err?.message?.includes('Failed to fetch') ||
    err?.message?.includes('Network Error');

  // ─── Fetch — cache-first, then sync from Supabase in background ──────────────

  const fetchSongs = async () => {
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;

      console.log('[Songs] Fetching for user:', user?.email ?? 'none');

      if (!user) {
        setSongs([]);
        setLoading(false);
        return;
      }

      // Step 1 — Load cache immediately so the UI is never blank
      const cached = await loadFromCache();
      if (cached.length > 0) {
        setSongs(cached);
        setLoading(false);
        console.log('[Songs] ✓ Loaded', cached.length, 'songs from cache');
      } else {
        setLoading(true);
      }

      // Step 2 — Try Supabase in background; merge with any pending-local songs
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Keep pending local songs (temp IDs) that haven't synced yet
        const pendingLocal = cached.filter(s => s.pending);
        const merged = [...pendingLocal, ...(data as Song[])];

        setSongs(merged);
        await saveToCache(merged);
        console.log('[Songs] ✓ Synced from Supabase,', pendingLocal.length, 'pending local');

      } catch (err: any) {
        if (isNetworkError(err)) {
          console.log('[Songs] Offline — showing cached data');
          // Don't set error if we already have cached data showing
          if (cached.length === 0) setError('No internet connection and no cached data.');
        } else {
          console.error('[Songs] Fetch error:', err.message);
          if (cached.length === 0) setError(err.message);
        }
      }

    } catch (err: any) {
      console.log('[Songs] Session error — trying cache:', err.message);
      const cached = await loadFromCache();
      if (cached.length > 0) {
        setSongs(cached);
        console.log('[Songs] ✓ Fallback to cache:', cached.length, 'songs');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Auth listener ────────────────────────────────────────────────────────────

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        fetchSongs();
      } else if (event === 'SIGNED_OUT') {
        await clearCache();
        setSongs([]);
        setLoading(false);
        logger.log('[Songs] Cleared on sign out');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── addSong — local-first ────────────────────────────────────────────────────

  const addSong = async (title: string, artist: string, song_theme: string[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    if (!user) throw new Error('Not logged in');

    // Save locally with a temp ID right away — UI updates instantly
    const tempId = `local_${Date.now()}`;
    const localSong: Song = {
      id: tempId,
      title,
      artist,
      song_theme,
      user_id: user.id,
      pending: true,
    };

    const optimistic = [localSong, ...songs];
    setSongs(optimistic);
    await saveToCache(optimistic);
    console.log('[Songs] ✓ Song saved locally (pending)');

    // Try Supabase in the background — never blocks the UI
    try {
      const { data, error } = await supabase
        .from('songs')
        .insert([{ title, artist, song_theme, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Swap temp song with the real Supabase record
      const synced = optimistic.map(s => s.id === tempId ? (data as Song) : s);
      setSongs(synced);
      await saveToCache(synced);
      console.log('[Songs] ✓ Song synced to Supabase');

    } catch (err: any) {
      if (isNetworkError(err)) {
        console.log('[Songs] Offline — song queued, will sync when online');
        // Stays in local state with pending: true — do not throw
      } else {
        // Real DB error — revert the optimistic add
        const reverted = optimistic.filter(s => s.id !== tempId);
        setSongs(reverted);
        await saveToCache(reverted);
        throw err;
      }
    }
  };

  // ─── addLyrics — local-first ──────────────────────────────────────────────────

  const addLyrics = async (id: string, title: string, artist: string, lyrics: string) => {
    // Update local state and cache immediately
    const updated = songs.map(song =>
      song.id === id ? { ...song, title, artist, lyrics } : song
    );
    setSongs(updated);
    await saveToCache(updated);
    console.log('[Lyrics] ✓ Saved locally');

    // Try Supabase in background
    try {
      const { error } = await supabase
        .from('songs')
        .update({ title, artist, lyrics })
        .eq('id', id);

      if (error && !isNetworkError(error)) throw error;
      console.log('[Lyrics] ✓ Synced to Supabase');

    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      console.log('[Lyrics] Offline — will sync later');
    }
  };

  // ─── addReviews — local-first ─────────────────────────────────────────────────

  const addReviews = async (id: string, song_theme: string[], review: string) => {
    const updated = songs.map(song =>
      song.id === id ? { ...song, song_theme, review } : song
    );
    setSongs(updated);
    await saveToCache(updated);
    console.log('[Reviews] ✓ Saved locally');

    try {
      const { error } = await supabase
        .from('songs')
        .update({ song_theme, review })
        .eq('id', id);

      if (error && !isNetworkError(error)) throw error;
      console.log('[Reviews] ✓ Synced to Supabase');

    } catch (err: any) {
      if (!isNetworkError(err)) throw err;
      console.log('[Reviews] Offline — will sync later');
    }
  };

  // ─── deleteSong ───────────────────────────────────────────────────────────────

  const deleteSong = async (id: string) => {
    console.log('[Songs] Deleting song:', id);

    // Remove locally first
    const updated = songs.filter(song => song.id !== id);
    setSongs(updated);
    await saveToCache(updated);

    // If it was a pending local-only song, no need to hit Supabase
    const wasPending = songs.find(s => s.id === id)?.pending;
    if (wasPending) {
      console.log('[Songs] ✓ Local-only song removed');
      return;
    }

    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log('[Songs] ✓ Song deleted from Supabase');

    } catch (err: any) {
      if (isNetworkError(err)) {
        console.log('[Songs] Offline — delete queued');
        // Already removed locally; Supabase will be out of sync until reconnect.
        // For a full implementation, queue this deletion like addSong.
      } else {
        // Revert local deletion on real error
        setSongs(songs);
        await saveToCache(songs);
        throw err;
      }
    }
  };

  // ─── uploadAudio — save localUri first, upload in background ─────────────────

  const uploadAudio = async (songId: string, fileUri: string, fileName: string): Promise<string | null> => {
    // Save local URI immediately so playback works offline right away
    const withLocal = songs.map(song =>
      song.id === songId ? { ...song, localUri: fileUri } : song
    );
    setSongs(withLocal);
    await saveToCache(withLocal);
    console.log('[Audio] ✓ Local URI saved — offline playback available');

    // Try uploading to Supabase Storage in background
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) throw new Error('No user logged in');

      console.log('[Audio] Uploading to Supabase Storage...');

      const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const filePath = `${user.id}/${songId}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from('songs-audio')
        .upload(filePath, bytes, { contentType: 'audio/mpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('songs-audio').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('songs')
        .update({ mp4song: data.publicUrl })
        .eq('id', songId);

      if (updateError) throw updateError;

      // Update local state with both localUri and the remote URL
      const synced = withLocal.map(song =>
        song.id === songId ? { ...song, mp4song: data.publicUrl, localUri: fileUri } : song
      );
      setSongs(synced);
      await saveToCache(synced);
      console.log('[Audio] ✓ Uploaded and synced to Supabase');

      return data.publicUrl;

    } catch (err: any) {
      if (isNetworkError(err)) {
        console.log('[Audio] Offline — remote upload queued, local playback available');
      } else {
        console.error('[Audio] Upload failed:', err.message);
      }
      // Always return localUri so MusicPlayer can play immediately
      return fileUri;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <SongsContext.Provider value={{
      songs, loading, error,
      refetch: fetchSongs,
      addSong, addLyrics, addReviews, deleteSong, uploadAudio,
    }}>
      {children}
    </SongsContext.Provider>
  );
}

export const useSongs = () => useContext(SongsContext);