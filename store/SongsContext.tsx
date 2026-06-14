// store/SongsContext.tsx
import { Song } from '@/types/songs';
import { logger } from '@/utils/logger';
import { supabase } from '@/utils/supabase';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

// ─── Types ────────────────────────────────────────────────────────────────────

type PendingOp =
  | { type: 'ADD';    tempId: string; song: Omit<Song, 'id'> }
  | { type: 'UPDATE'; id: string;     fields: Partial<Song> }
  | { type: 'DELETE'; id: string }
  | { type: 'AUDIO';  id: string;     localUri: string; fileName: string };

type SongsContextType = {
  songs: Song[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addSong:     (title: string, artist: string, song_theme: string[]) => Promise<void>;
  addLyrics:   (id: string, title: string, artist: string, lyrics: string) => Promise<void>;
  addReviews:  (id: string, song_theme: string[], review: string) => Promise<void>;
  deleteSong:  (id: string) => Promise<void>;
  uploadAudio: (songId: string, fileUri: string, fileName: string) => Promise<string | null>;
};

const SongsContext = createContext<SongsContextType>({
  songs: [], loading: true, error: null,
  refetch:     async () => {},
  addSong:     async () => {},
  addLyrics:   async () => {},
  addReviews:  async () => {},
  deleteSong:  async () => {},
  uploadAudio: async () => null,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs]     = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Ref so async callbacks always read latest songs without stale closure
  const songsRef = useRef<Song[]>([]);
  useEffect(() => { songsRef.current = songs; }, [songs]);

  // ─── Network check — no extra package needed ──────────────────────────────

  const isOnline = async (): Promise<boolean> => {
    try {
      const res = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const isNetworkError = (err: any): boolean =>
    err?.message?.includes('Network request failed') ||
    err?.message?.includes('Failed to fetch') ||
    err?.message?.includes('Network Error');

  // ─── Cache helpers ────────────────────────────────────────────────────────

  const getCacheKey = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user ? `songs_${user.id}` : null;
    } catch { return null; }
  };

  const getQueueKey = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user ? `pending_ops_${user.id}` : null;
    } catch { return null; }
  };

  const saveToCache = async (data: Song[]) => {
    try {
      const key = await getCacheKey();
      if (key) await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch { console.log('[Cache] Save failed'); }
  };

  const loadFromCache = async (): Promise<Song[]> => {
    try {
      const key = await getCacheKey();
      if (!key) return [];
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const clearCache = async () => {
    try {
      const key  = await getCacheKey();
      const qKey = await getQueueKey();
      if (key)  await AsyncStorage.removeItem(key);
      if (qKey) await AsyncStorage.removeItem(qKey);
    } catch { console.log('[Cache] Clear failed'); }
  };

  // ─── Pending-op queue ─────────────────────────────────────────────────────

  const loadQueue = async (): Promise<PendingOp[]> => {
    try {
      const key = await getQueueKey();
      if (!key) return [];
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const saveQueue = async (ops: PendingOp[]) => {
    try {
      const key = await getQueueKey();
      if (key) await AsyncStorage.setItem(key, JSON.stringify(ops));
    } catch { console.log('[Queue] Save failed'); }
  };

  const enqueue = async (op: PendingOp) => {
    const queue = await loadQueue();
    await saveQueue([...queue, op]);
    console.log('[Queue] Enqueued:', op.type);
  };

  // ─── Flush pending ops to Supabase ───────────────────────────────────────

  const flushQueue = async () => {
    try {
      const queue = await loadQueue();
      if (queue.length === 0) return;

      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) return;

      console.log('[Sync] Flushing', queue.length, 'pending ops...');

      const remaining: PendingOp[] = [];
      let current = [...songsRef.current];

      for (const op of queue) {
        try {
          if (op.type === 'ADD') {
            const { title, artist, song_theme, lyrics, review } = op.song as any;
            const { data, error } = await supabase
              .from('songs')
              .insert([{ title, artist, song_theme, lyrics, review, user_id: user.id }])
              .select()
              .single();

            if (error) throw error;

            current = current.map(s =>
              s.id === op.tempId
                ? { ...(data as Song), localUri: (s as any).localUri, pending: false }
                : s
            );
            console.log('[Sync] ADD synced:', op.tempId, '→', (data as any).id);

          } else if (op.type === 'UPDATE') {
            const { error } = await supabase
              .from('songs')
              .update(op.fields)
              .eq('id', op.id);
            if (error) throw error;

            current = current.map(s =>
              s.id === op.id ? { ...s, ...op.fields, pending: false } : s
            );
            console.log('[Sync] UPDATE synced:', op.id);

          } else if (op.type === 'DELETE') {
            const { error } = await supabase
              .from('songs')
              .delete()
              .eq('id', op.id);
            if (error) throw error;
            console.log('[Sync] DELETE synced:', op.id);

          } else if (op.type === 'AUDIO') {
            const base64 = await FileSystem.readAsStringAsync(op.localUri, { encoding: 'base64' });
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

            const realSong = current.find(s => s.id === op.id);
            const realId   = realSong?.id ?? op.id;
            const filePath = `${user.id}/${realId}.mp3`;

            const { error: uploadErr } = await supabase.storage
              .from('songs-audio')
              .upload(filePath, bytes, { contentType: 'audio/mpeg', upsert: true });
            if (uploadErr) throw uploadErr;

            const { data } = supabase.storage.from('songs-audio').getPublicUrl(filePath);

            const { error: updateErr } = await supabase
              .from('songs')
              .update({ mp4song: data.publicUrl })
              .eq('id', realId);
            if (updateErr) throw updateErr;

            current = current.map(s =>
              s.id === realId ? { ...s, mp4song: data.publicUrl } : s
            );
            console.log('[Sync] AUDIO synced:', realId);
          }

        } catch (err: any) {
          console.warn('[Sync] Op failed, will retry:', op.type, err.message);
          remaining.push(op);
        }
      }

      setSongs(current);
      await saveToCache(current);
      await saveQueue(remaining);
      console.log('[Sync] Done.', remaining.length, 'ops still pending');

    } catch (err: any) {
      console.warn('[Sync] flushQueue error:', err.message);
    }
  };

  // ─── fetchSongs — cache-first, Supabase only when online ─────────────────

  const fetchSongs = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;

      if (!user) {
        setSongs([]);
        setLoading(false);
        return;
      }

      // Step 1 — Load cache immediately, works offline
      const cached = await loadFromCache();
      if (cached.length > 0) {
        setSongs(cached);
        setLoading(false);
        console.log('[Songs] ✓ Loaded', cached.length, 'from cache');
      }

      // Step 2 — Check connectivity; if offline serve cache and stop
      const online = await isOnline();
      if (!online) {
        console.log('[Songs] Offline — serving cache only');
        if (cached.length === 0) setError('You are offline and have no cached songs.');
        setLoading(false);
        return;
      }

      // Step 3 — Online: flush pending ops first, then fetch fresh data
      await flushQueue();

      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Preserve any still-pending local songs on top
        const stillPending = songsRef.current.filter(s => s.pending);
        const merged = [...stillPending, ...(data as Song[])];

        setSongs(merged);
        await saveToCache(merged);
        console.log('[Songs] ✓ Synced. Still pending:', stillPending.length);

      } catch (err: any) {
        console.error('[Songs] Supabase fetch error:', err.message);
        if (cached.length === 0) setError('Failed to load songs. Pull to retry.');
      }

    } catch (err: any) {
      console.log('[Songs] Outer error:', err.message);
      const cached = await loadFromCache();
      if (cached.length > 0) {
        setSongs(cached);
      } else {
        setError('Failed to load songs. Pull to retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Auth listener ────────────────────────────────────────────────────────

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        await fetchSongs();
      } else if (event === 'SIGNED_OUT') {
        await clearCache();
        setSongs([]);
        setLoading(false);
        logger.log('[Songs] Cleared on sign out');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ─── Background sync — poll every 15s, flush queue when online ───────────

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const queue = await loadQueue();
        if (queue.length === 0) return;
        const online = await isOnline();
        if (online) {
          console.log('[Sync] Background — internet restored, flushing queue');
          await flushQueue();
        }
      } catch (err: any) {
        console.warn('[Sync] Background poll error:', err.message);
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  // ─── addSong ──────────────────────────────────────────────────────────────

  const addSong = async (title: string, artist: string, song_theme: string[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    if (!user) throw new Error('Not logged in');

    const tempId = `local_${Date.now()}`;
    const localSong: Song = { id: tempId, title, artist, song_theme, user_id: user.id, pending: true };

    const updated = [localSong, ...songsRef.current];
    setSongs(updated);
    await saveToCache(updated);
    console.log('[Songs] ✓ Saved locally:', tempId);

    const online = await isOnline();
    if (!online) {
      await enqueue({ type: 'ADD', tempId, song: { title, artist, song_theme, user_id: user.id } as any });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('songs')
        .insert([{ title, artist, song_theme, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const synced = updated.map(s => s.id === tempId ? (data as Song) : s);
      setSongs(synced);
      await saveToCache(synced);
      console.log('[Songs] ✓ Synced to Supabase');

    } catch (err: any) {
      if (isNetworkError(err)) {
        await enqueue({ type: 'ADD', tempId, song: { title, artist, song_theme, user_id: user.id } as any });
      } else {
        const reverted = updated.filter(s => s.id !== tempId);
        setSongs(reverted);
        await saveToCache(reverted);
        throw err;
      }
    }
  };

  // ─── addLyrics ────────────────────────────────────────────────────────────

  const addLyrics = async (id: string, title: string, artist: string, lyrics: string) => {
    const fields = { title, artist, lyrics };
    const updated = songsRef.current.map(s => s.id === id ? { ...s, ...fields } : s);
    setSongs(updated);
    await saveToCache(updated);
    console.log('[Lyrics] ✓ Saved locally');

    const online = await isOnline();
    if (!online) { await enqueue({ type: 'UPDATE', id, fields }); return; }

    try {
      const { error } = await supabase.from('songs').update(fields).eq('id', id);
      if (error && !isNetworkError(error)) throw error;
      console.log('[Lyrics] ✓ Synced');
    } catch (err: any) {
      if (isNetworkError(err)) await enqueue({ type: 'UPDATE', id, fields });
      else throw err;
    }
  };

  // ─── addReviews ───────────────────────────────────────────────────────────

  const addReviews = async (id: string, song_theme: string[], review: string) => {
    const fields = { song_theme, review };
    const updated = songsRef.current.map(s => s.id === id ? { ...s, ...fields } : s);
    setSongs(updated);
    await saveToCache(updated);
    console.log('[Reviews] ✓ Saved locally');

    const online = await isOnline();
    if (!online) { await enqueue({ type: 'UPDATE', id, fields }); return; }

    try {
      const { error } = await supabase.from('songs').update(fields).eq('id', id);
      if (error && !isNetworkError(error)) throw error;
      console.log('[Reviews] ✓ Synced');
    } catch (err: any) {
      if (isNetworkError(err)) await enqueue({ type: 'UPDATE', id, fields });
      else throw err;
    }
  };

  // ─── deleteSong ───────────────────────────────────────────────────────────

  const deleteSong = async (id: string) => {
    const wasPending = songsRef.current.find(s => s.id === id)?.pending;
    const updated = songsRef.current.filter(s => s.id !== id);
    setSongs(updated);
    await saveToCache(updated);
    console.log('[Songs] ✓ Deleted locally');

    if (wasPending) {
      const queue = await loadQueue();
      await saveQueue(queue.filter(op => !(op.type === 'ADD' && op.tempId === id)));
      return;
    }

    const online = await isOnline();
    if (!online) { await enqueue({ type: 'DELETE', id }); return; }

    try {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
      console.log('[Songs] ✓ Deleted from Supabase');
    } catch (err: any) {
      if (isNetworkError(err)) await enqueue({ type: 'DELETE', id });
      else {
        setSongs(songsRef.current);
        await saveToCache(songsRef.current);
        throw err;
      }
    }
  };

  // ─── uploadAudio ──────────────────────────────────────────────────────────

  const uploadAudio = async (songId: string, fileUri: string, fileName: string): Promise<string | null> => {
    const withLocal = songsRef.current.map(s => s.id === songId ? { ...s, localUri: fileUri } : s);
    setSongs(withLocal);
    await saveToCache(withLocal);
    console.log('[Audio] ✓ LocalUri saved — offline playback ready');

    const online = await isOnline();
    if (!online) {
      await enqueue({ type: 'AUDIO', id: songId, localUri: fileUri, fileName });
      return fileUri;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user) throw new Error('Not logged in');

      const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

      const filePath = `${user.id}/${songId}.mp3`;
      const { error: uploadErr } = await supabase.storage
        .from('songs-audio')
        .upload(filePath, bytes, { contentType: 'audio/mpeg', upsert: true });
      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from('songs-audio').getPublicUrl(filePath);

      const { error: updateErr } = await supabase
        .from('songs')
        .update({ mp4song: data.publicUrl })
        .eq('id', songId);
      if (updateErr) throw updateErr;

      const synced = withLocal.map(s =>
        s.id === songId ? { ...s, mp4song: data.publicUrl, localUri: fileUri } : s
      );
      setSongs(synced);
      await saveToCache(synced);
      console.log('[Audio] ✓ Uploaded to Supabase');
      return data.publicUrl;

    } catch (err: any) {
      if (isNetworkError(err)) {
        await enqueue({ type: 'AUDIO', id: songId, localUri: fileUri, fileName });
        console.log('[Audio] Offline — queued for upload');
      } else {
        console.error('[Audio] Upload failed:', err.message);
      }
      return fileUri;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <SongsContext.Provider value={{
      songs, loading, error,
      refetch: () => fetchSongs(true),
      addSong, addLyrics, addReviews, deleteSong, uploadAudio,
    }}>
      {children}
    </SongsContext.Provider>
  );
}

export const useSongs = () => useContext(SongsContext);