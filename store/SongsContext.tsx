// store/SongsContext.tsx
import { Song } from '@/types/songs';
import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext'; 

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
  debugLog: string[];
  refetch: () => Promise<void>;
  addSong:     (title: string, artist: string, song_theme: string[]) => Promise<void>;
  addLyrics:   (id: string, title: string, artist: string, lyrics: string) => Promise<void>;
  addReviews:  (id: string, song_theme: string[], review: string) => Promise<void>;
  deleteSong:  (id: string) => Promise<void>;
  uploadAudio: (songId: string, fileUri: string, fileName: string) => Promise<string | null>;
};

const SongsContext = createContext<SongsContextType>({
  songs: [], loading: true, error: null, debugLog: [],
  refetch:     async () => {},
  addSong:     async () => {},
  addLyrics:   async () => {},
  addReviews:  async () => {},
  deleteSong:  async () => {},
  uploadAudio: async () => null,
});

export function SongsProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth(); 

  const [songs, setSongs]       = useState<Song[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const songsRef    = useRef<Song[]>([]);
  const fetchingRef = useRef(false);
  const fetchStartTimeRef = useRef<number>(0); // stale-lock detection
  const logRef      = useRef<string[]>([]);

  useEffect(() => { songsRef.current = songs; }, [songs]);

  // ─── In-app logger ────────────────────────────────────────────────────────

  const log = (msg: string) => {
    const ts  = new Date().toLocaleTimeString();
    const line = `[${ts}] ${msg}`;
    console.log(line);
    const next = [...logRef.current.slice(-49), line];
    logRef.current = next;
    setDebugLog([...next]);
  };

  // ─── Session — reads AsyncStorage only, NEVER hits network ───────────────

  const getLocalSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch { return null; }
  };

  const getUserId = async (): Promise<string | null> => {
    const s = await getLocalSession();
    return s?.user?.id ?? null;
  };

  // ─── isOnline — 3s hard timeout ──────────────────────────────────────────
  const isOnline = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 3000);
      // mode: 'no-cors' is required on web — a plain cross-origin fetch to
      // google.com gets blocked by CORS in the browser (it doesn't send
      // permissive CORS headers), which made isOnline() always return
      // false on web even when the network was fine. With no-cors we get
      // an opaque response but no CORS error, so resolving (vs throwing)
      // is enough to confirm reachability. No effect on native, where
      // CORS was never enforced in the first place.
      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD', cache: 'no-cache', mode: 'no-cors', signal: controller.signal,
      });
      clearTimeout(tid);
      return true;
    } catch {
      return false;
    }
  };

  const isNetworkError = (err: any): boolean =>
    err?.message?.includes('Network request failed') ||
    err?.message?.includes('Failed to fetch') ||
    err?.message?.includes('Network Error') ||
    err?.name === 'AbortError';

  // ─── Cache ────────────────────────────────────────────────────────────────

  const getCacheKey = async () => { const u = await getUserId(); return u ? `songs_${u}` : null; };
  const getQueueKey = async () => { const u = await getUserId(); return u ? `pending_ops_${u}` : null; };

  const saveToCache = async (data: Song[]) => {
    try {
      const key = await getCacheKey();
      if (key) { await AsyncStorage.setItem(key, JSON.stringify(data)); log(`Cache saved: ${data.length} songs`); }
    } catch (e: any) { log(`Cache save failed: ${e.message}`); }
  };

  const loadFromCache = async (): Promise<Song[]> => {
    try {
      const key = await getCacheKey();
      if (!key) { log('Cache: no key (not logged in)'); return []; }
      const raw = await AsyncStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      log(`Cache loaded: ${parsed.length} songs (${parsed.filter((s:Song) => s.pending).length} pending)`);
      return parsed;
    } catch { return []; }
  };

  const clearCache = async () => {
    try {
      const key  = await getCacheKey();
      const qKey = await getQueueKey();
      if (key)  await AsyncStorage.removeItem(key);
      if (qKey) await AsyncStorage.removeItem(qKey);
      log('Cache cleared');
    } catch {}
  };

  // ─── Queue ────────────────────────────────────────────────────────────────

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
    } catch {}
  };

  const enqueue = async (op: PendingOp) => {
    const queue = await loadQueue();
    if (op.type === 'UPDATE') {
      const fieldKey = JSON.stringify(Object.keys(op.fields).sort());
      const idx = queue.findIndex(o =>
        o.type === 'UPDATE' && o.id === op.id &&
        JSON.stringify(Object.keys((o as any).fields).sort()) === fieldKey
      );
      if (idx >= 0) { queue[idx] = op; await saveQueue(queue); log(`Queue: replaced UPDATE for ${op.id}`); return; }
    }
    await saveQueue([...queue, op]);
    log(`Queue: added ${op.type} | total: ${queue.length + 1}`);
  };

  // ─── flushQueue — pure data transform, never sets React state ────────────

  const flushQueue = async (localSongs: Song[]): Promise<{ flushed: Song[]; remaining: PendingOp[] }> => {
    const queue = await loadQueue();
    if (queue.length === 0) return { flushed: localSongs, remaining: [] };

    const session = await getLocalSession();
    const user = session?.user ?? null;
    if (!user) return { flushed: localSongs, remaining: queue };

    log(`Sync: flushing ${queue.length} ops...`);

    const remaining: PendingOp[] = [];
    let current = [...localSongs];

    for (const op of queue) {
      try {
        if (op.type === 'ADD') {
          const { title, artist, song_theme, lyrics, review } = op.song as any;
          const { data, error } = await supabase
            .from('songs')
            .insert([{ title, artist, song_theme, lyrics, review, user_id: user.id }])
            .select().single();
          if (error) throw error;

          current = current.map(s =>
            s.id === op.tempId
              ? { ...(data as Song), localUri: (s as any).localUri, pending: false }
              : s
          );
          log(`Sync: ADD done ${op.tempId} → ${(data as any).id}`);

        } else if (op.type === 'UPDATE') {
          const song = current.find(s => s.id === op.id);
          if (song?.pending) { remaining.push(op); continue; }
          const { error } = await supabase.from('songs').update(op.fields).eq('id', op.id);
          if (error) throw error;
          current = current.map(s => s.id === op.id ? { ...s, ...op.fields, pending: false } : s);
          log(`Sync: UPDATE done ${op.id}`);

        } else if (op.type === 'DELETE') {
          const song = current.find(s => s.id === op.id);
          if (song?.pending) { current = current.filter(s => s.id !== op.id); continue; }
          
          const { error } = await supabase.from('songs').delete().eq('id', op.id);
          if (error) throw error;
          log(`Sync: DELETE done ${op.id}`);

            // Because queued deletions also need their storage file cleaned up
            const filePath = `${user.id}/${op.id}.mp3`;
            const { error: storageErr } = await supabase.storage
              .from('songs-audio')
              .remove([filePath]);
            if (storageErr) log(`Sync: storage cleanup skipped ${op.id} — ${storageErr.message}`);
            else log(`Sync: storage file removed ${op.id}`);

        } else if (op.type === 'AUDIO') {
          const song = current.find(s => s.id === op.id);
          if (song?.pending) { remaining.push(op); continue; }

          const base64 = await FileSystem.readAsStringAsync(op.localUri, { encoding: 'base64' });
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

          const filePath = `${user.id}/${op.id}.mp3`;
          const { error: uploadErr } = await supabase.storage
            .from('songs-audio').upload(filePath, bytes, { contentType: 'audio/mpeg', upsert: true });
          if (uploadErr) throw uploadErr;

          const { data } = supabase.storage.from('songs-audio').getPublicUrl(filePath);
          const { error: updateErr } = await supabase.from('songs').update({ mp4song: data.publicUrl }).eq('id', op.id);
          if (updateErr) throw updateErr;

          current = current.map(s => s.id === op.id ? { ...s, mp4song: data.publicUrl } : s);
          log(`Sync: AUDIO done ${op.id}`);
        }

      } catch (err: any) {
        log(`Sync: FAILED ${op.type} — ${err.message}`);
        remaining.push(op);
      }
    }

    await saveQueue(remaining);
    log(`Sync: done. ${remaining.length} still pending`);
    return { flushed: current, remaining };
  };

  // ─── fetchSongs ───────────────────────────────────────────────────────────

  const fetchSongs = async (isRefresh = false) => {
    if (fetchingRef.current) {
      const elapsed = Date.now() - fetchStartTimeRef.current;
      if (elapsed < 15000) {
        log('Fetch already running, skipped');
        return;
      }
      log('Fetch lock stale (>15s) — forcing through');
    }
    fetchingRef.current = true;
    fetchStartTimeRef.current = Date.now();
    if (!isRefresh) setLoading(true);
    setError(null);

    try {
      const uid = await getUserId();
      if (!uid) { log('No user session'); setSongs([]); setLoading(false); fetchingRef.current = false; return; }

      const cached = await loadFromCache();
      if (cached.length > 0) {
        setSongs(cached);
        songsRef.current = cached;
        setLoading(false);
      }

      log('Checking network...');
      const online = await isOnline();
      log(`Network: ${online ? 'ONLINE' : 'OFFLINE'}`);

      if (!online) {
        if (cached.length === 0) setError('Offline — no cached songs yet.');
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      const { flushed } = await flushQueue(cached.length > 0 ? cached : songsRef.current);

      try {
        const { data, error } = await supabase
          .from('songs').select('*').eq('user_id', uid).order('created_at', { ascending: false });
        if (error) throw error;

        const stillPending = flushed.filter(s => s.pending);
        const merged = [...stillPending, ...(data as Song[])];

        setSongs(merged);
        songsRef.current = merged;
        await saveToCache(merged);
        log(`Fetch done: ${data.length} from Supabase, ${stillPending.length} still pending`);

      } catch (err: any) {
        log(`Supabase fetch failed: ${err.message}`);
        setSongs(flushed);
        songsRef.current = flushed;
        await saveToCache(flushed);
        if (cached.length === 0) setError('Failed to load. Pull to retry.');
      }

    } catch (err: any) {
      log(`fetchSongs crashed: ${err.message}`);
      const cached = await loadFromCache();
      if (cached.length > 0) { setSongs(cached); songsRef.current = cached; }
      else setError('Failed to load. Pull to retry.');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (session) {
      log(`Session present (${session.user?.email}) — fetching songs`);
      fetchSongs();
    } else {
      log('No session — clearing songs');
      clearCache();
      setSongs([]); songsRef.current = [];
      setLoading(false);
    }
  }, [session, authLoading]);

  // ─── Background sync every 15s ────────────────────────────────────────────

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const queue = await loadQueue();
        if (queue.length === 0) return;
        const online = await isOnline();
        if (!online) { log(`BG sync: offline, ${queue.length} ops waiting`); return; }
        log(`BG sync: online, flushing ${queue.length} ops`);
        const { flushed } = await flushQueue(songsRef.current);
        setSongs(flushed);
        songsRef.current = flushed;
        await saveToCache(flushed);
      } catch (err: any) {
        log(`BG sync error: ${err.message}`);
      }
    }, 15000);
    return () => clearInterval(id);
  }, []);

  // ─── addSong ──────────────────────────────────────────────────────────────

  const addSong = async (title: string, artist: string, song_theme: string[]) => {
    const uid = await getUserId();
    if (!uid) throw new Error('Not logged in');

    const tempId = `local_${Date.now()}`;
    const localSong: Song = { id: tempId, title, artist, song_theme, user_id: uid, pending: true };
    const updated = [localSong, ...songsRef.current];
    setSongs(updated); songsRef.current = updated;
    await saveToCache(updated);
    log(`addSong: saved locally as ${tempId}`);

    const online = await isOnline();
    log(`addSong: online=${online}`);

    if (!online) {
      await enqueue({ type: 'ADD', tempId, song: { title, artist, song_theme, user_id: uid } as any });
      log('addSong: queued for later sync');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('songs').insert([{ title, artist, song_theme, user_id: uid }]).select().single();
      if (error) throw error;

      const synced = songsRef.current.map(s => s.id === tempId ? (data as Song) : s);
      setSongs(synced); songsRef.current = synced;
      await saveToCache(synced);
      log(`addSong: synced immediately → ${(data as any).id}`);

    } catch (err: any) {
      if (isNetworkError(err)) {
        await enqueue({ type: 'ADD', tempId, song: { title, artist, song_theme, user_id: uid } as any });
        log('addSong: network failed mid-add, queued');
      } else {
        const reverted = songsRef.current.filter(s => s.id !== tempId);
        setSongs(reverted); songsRef.current = reverted;
        await saveToCache(reverted);
        throw err;
      }
    }
  };

  // ─── addLyrics ────────────────────────────────────────────────────────────

  const addLyrics = async (id: string, title: string, artist: string, lyrics: string) => {
    const fields = { title, artist, lyrics };
    const updated = songsRef.current.map(s => s.id === id ? { ...s, ...fields } : s);
    setSongs(updated); songsRef.current = updated;
    await saveToCache(updated);
    log(`addLyrics: saved locally for ${id}`);

    const online = await isOnline();
    if (!online) { await enqueue({ type: 'UPDATE', id, fields }); log('addLyrics: queued'); return; }
    try {
      const { error } = await supabase.from('songs').update(fields).eq('id', id);
      if (error && !isNetworkError(error)) throw error;
      log(`addLyrics: synced ${id}`);
    } catch (err: any) {
      if (isNetworkError(err)) { await enqueue({ type: 'UPDATE', id, fields }); log('addLyrics: queued after fail'); }
      else throw err;
    }
  };

  // ─── addReviews ───────────────────────────────────────────────────────────

  const addReviews = async (id: string, song_theme: string[], review: string) => {
    const fields = { song_theme, review };
    const updated = songsRef.current.map(s => s.id === id ? { ...s, ...fields } : s);
    setSongs(updated); songsRef.current = updated;
    await saveToCache(updated);
    log(`addReviews: saved locally for ${id}`);

    const online = await isOnline();
    if (!online) { await enqueue({ type: 'UPDATE', id, fields }); log('addReviews: queued'); return; }
    try {
      const { error } = await supabase.from('songs').update(fields).eq('id', id);
      if (error && !isNetworkError(error)) throw error;
      log(`addReviews: synced ${id}`);
    } catch (err: any) {
      if (isNetworkError(err)) { await enqueue({ type: 'UPDATE', id, fields }); log('addReviews: queued after fail'); }
      else throw err;
    }
  };

  // ─── deleteSong ───────────────────────────────────────────────────────────

  const deleteSong = async (id: string) => {
    const wasPending = songsRef.current.find(s => s.id === id)?.pending;
    const updated = songsRef.current.filter(s => s.id !== id);
    setSongs(updated); songsRef.current = updated;
    await saveToCache(updated);
    log(`deleteSong: removed locally ${id}`);

    if (wasPending) {
      const queue = await loadQueue();
      await saveQueue(queue.filter(op => !(op.type === 'ADD' && op.tempId === id)));
      log('deleteSong: was local-only, removed from queue');
      return;
    }

    const online = await isOnline();
    if (!online) { await enqueue({ type: 'DELETE', id }); return; }
    try {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
      log(`deleteSong: synced ${id}`);

      const session = await getLocalSession();
      const user = session?.user ?? null;
      if (user) {
        const filePath = `${user.id}/${id}.mp3`;
        const { error: storageErr } = await supabase.storage
          .from('songs-audio').remove([filePath]);

          if (storageErr) log(`deleteSong: storage cleanup skipped — ${storageErr.message}`);
          else log(`deleteSong: storage file removed ${id}`);
      }
    } catch (err: any) {
      if (isNetworkError(err)) await enqueue({ type: 'DELETE', id });
      else throw err;
    }
  };

  // ─── uploadAudio ──────────────────────────────────────────────────────────

  const uploadAudio = async (songId: string, fileUri: string, fileName: string): Promise<string | null> => {
    const withLocal = songsRef.current.map(s => s.id === songId ? { ...s, localUri: fileUri } : s);
    setSongs(withLocal); songsRef.current = withLocal;
    await saveToCache(withLocal);
    log(`uploadAudio: localUri saved for ${songId}`);

    const online = await isOnline();
    if (!online) { await enqueue({ type: 'AUDIO', id: songId, localUri: fileUri, fileName }); return fileUri; }

    try {
      const session = await getLocalSession();
      const user = session?.user ?? null;
      if (!user) throw new Error('Not logged in');

      const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

      const filePath = `${user.id}/${songId}.mp3`;
      const { error: uploadErr } = await supabase.storage
        .from('songs-audio').upload(filePath, bytes, { contentType: 'audio/mpeg', upsert: true });
      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from('songs-audio').getPublicUrl(filePath);
      const { error: updateErr } = await supabase.from('songs').update({ mp4song: data.publicUrl }).eq('id', songId);
      if (updateErr) throw updateErr;

      const synced = withLocal.map(s => s.id === songId ? { ...s, mp4song: data.publicUrl, localUri: fileUri } : s);
      setSongs(synced); songsRef.current = synced;
      await saveToCache(synced);
      log(`uploadAudio: synced ${songId}`);
      return data.publicUrl;

    } catch (err: any) {
      if (isNetworkError(err)) {
        await enqueue({ type: 'AUDIO', id: songId, localUri: fileUri, fileName });
        log('uploadAudio: queued');
      } else {
        log(`uploadAudio failed: ${err.message}`);
      }
      return fileUri;
    }
  };

  return (
    <SongsContext.Provider value={{
      songs, loading, error, debugLog,
      refetch: () => fetchSongs(true),
      addSong, addLyrics, addReviews, deleteSong, uploadAudio,
    }}>
      {children}
    </SongsContext.Provider>
  );
}

export const useSongs = () => useContext(SongsContext);