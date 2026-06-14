// store/SongsContext.tsx
import { Song } from '@/types/songs';
import { logger } from '@/utils/logger';
import { supabase } from '@/utils/supabase';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

// a strcuture of data that the fetching the songs will use
type SongsContextType = {
  songs: Song[]; // declares this as array
  loading: boolean; //notes if data being fetched?
  error: string | null; // either carries an error message string or none
  refetch: () => Promise<void>;
  addSong: (title: string, artist: string, song_theme: string[]) => Promise<void>; 
  addLyrics: (id: string, title: string, artist: string, lyrics: string) => Promise<void>;
  addReviews: (id: string, song_theme: string[], review: string) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;

  uploadAudio: (songId: string, fileUri: string, fileName:string) => Promise<string | null>;
};

// creates a container to hold data and share it across the app, that data is the built SongsContextType
const SongsContext = createContext<SongsContextType>({
  //these are the initial state
  songs: [], //starts an empty list first
  loading: true, 
  error: null,
  refetch: async () => {},
  addSong: async () => {},
  addLyrics: async () => {},
  addReviews: async () => {},
  deleteSong: async () => {},

  uploadAudio: async () => null,
});

//fetching of data
export function SongsProvider({ children }: { children: ReactNode}) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    //LOCAL-FIRST CHACHING
    //you need the user ID to namesapce the cache key so different users dont share the same cached songs
    const getCacheKey = async (): Promise<string | null> => {
        const { data: { user }} = await supabase.auth.getUser();
        return user ? `songs_${user.id}` : null;
    };

    //now save songs to AsyncStorage
    const saveToCache = async (data: Song[]) => {
        try {
            const key = await getCacheKey();
            if (key) {
                await AsyncStorage.setItem(key, JSON.stringify(data));
                console.log('[Songs] Cache Updated');
                }
            } catch {
                console.log('[Songs] Cache saved failed')
            }
    };

    //load songs from AsyncStorage
    const loadFromCache = async (): Promise<Song[]> => {
        try {
            const key = await getCacheKey();
            if (!key) return [];
            const cached = await AsyncStorage.getItem(key);
            return cached? JSON.parse(cached) : [];
        } catch {
            console.log('[Songs] Cache load failed')
            return [];
        }
    };

    //clear cache (your songs) on sign out
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

    const isNetworkError = (err: any): boolean => {
    return err?.message?.includes('Network request failed') ||
            err?.message?.includes('Failed to fetch') ||
            err?.message?.includes('Network Error');
    };

    //FETCH SONGS - LOCAL-FIRST then sybc with Supabase in the background

        //function to get the data
    const fetchSongs = async () => {
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user ?? null;

            console.log('[Songs] Fetching songs for user:', user?.email ?? 'none');

            if (!user) {
                setSongs([]);
                setLoading(false);
                return;
            }

            // Step 1 — Load from cache FIRST — always
            const cached = await loadFromCache();
                if (cached.length > 0) {
                setSongs(cached);
                setLoading(false);
                console.log('[Songs] ✓ Loaded', cached.length, 'songs from cache');
            } else {
                setLoading(true);
            }

            // Step 2 — Try Supabase in background
            try {
                const { data, error } = await supabase
                    .from('songs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setSongs(data as Song[]);
                await saveToCache(data as Song[]);
                console.log('[Songs] ✓ Synced from Supabase');

            } catch (err: any) {
                if (isNetworkError(err)) {
                    console.log('[Songs] Offline — showing cached data');
                } else {
                console.error('[Songs] Fetch error:', err.message);
                if (!cached.length) setError(err.message);
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
        
    // AUTH LISTENER
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            fetchSongs();
            } else if (event === 'SIGNED_OUT') {
            await clearCache(); //clear cache on signout
            setSongs([]);
            setLoading(false);
            logger.log('[Songs] Cleared songs on signed out');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // WRITE OPERATIONS - updates Supabase then update local state and cache
    const addSong = async (title: string, artist: string, song_theme: string[]) => {
    console.log('[Songs] Adding song:', title, artist, song_theme);

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;

    if (!user) {
        console.error('[Songs] No user logged in.');
        return;
    }

    try {
        const { data, error } = await supabase
        .from('songs')
        .insert([{ title, artist, song_theme, user_id: user.id }])
        .select()
        .single();

        if (error) throw error;

        const updated = [data as Song, ...songs];
        setSongs(updated);
        await saveToCache(updated);
        console.log('[Songs] ✓ Song added');

    } catch (err: any) {
        if (isNetworkError(err)) {
        console.log('[Songs] Cannot add song — offline');
        // Because we want to inform the user
        throw new Error('No internet connection. Please connect and try again.');
        }
        throw err;
    }
    };

    const addLyrics = async (id: string, title: string, artist: string, lyrics: string) => {
    try {
        const { error } = await supabase
        .from('songs')
        .update({ title, artist, lyrics })
        .eq('id', id);

        if (error) throw error;

        const updated = songs.map(song =>
        song.id === id ? { ...song, title, artist, lyrics } : song
        );
        setSongs(updated);
        await saveToCache(updated);

    } catch (err: any) {
        if (isNetworkError(err)) {
        throw new Error('No internet connection. Please connect and try again.');
        }
        throw err;
    }
    };

    const addReviews = async (id: string, song_theme: string[], review: string) => {
    try {
        const { error } = await supabase
        .from('songs')
        .update({ song_theme, review })
        .eq('id', id);

        if (error) throw error;

        const updated = songs.map(song =>
        song.id === id ? { ...song, song_theme, review } : song
        );
        setSongs(updated);
        await saveToCache(updated);

    } catch (err: any) {
        if (isNetworkError(err)) {
        throw new Error('No internet connection. Please connect and try again.');
        }
        throw err;
    }
    };

    const deleteSong = async (id: string) => {
    console.log('[Songs] Deleting song:', id);
    try {
        const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id);

        if (error) throw error;

        const updated = songs.filter(song => song.id !== id);
        setSongs(updated);
        await saveToCache(updated);
        console.log('[Songs] ✓ Song deleted');

    } catch (err: any) {
        if (isNetworkError(err)) {
        throw new Error('No internet connection. Please connect and try again.');
        }
        throw err;
    }
    };

    const uploadAudio = async (songId: string, fileUri: string, fileName: string): Promise<string | null> => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user ?? null;
            if (!user) throw new Error('No user logged in');

            console.log('[Audio] Starting upload...');
            console.log('[Audio] Song ID:', songId);
            console.log('[Audio] File name:', fileName);
            console.log('[Audio] File URI:', fileUri);

            const base64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: 'base64',
            });
            console.log('[Audio] ✓ File read as base64, length:', base64.length);

            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
            }
            console.log('[Audio] ✓ Converted to bytes, size:', bytes.length, 'bytes');

            const filePath = `${user.id}/${songId}.mp3`;
            console.log('[Audio] Uploading to path:', filePath);

            const { error: uploadError } = await supabase.storage
            .from('songs-audio')
            .upload(filePath, bytes, {
                contentType: 'audio/mpeg',
                upsert: true,
            });

            if (uploadError) throw uploadError;
            console.log('[Audio] ✓ File uploaded to Supabase Storage');

            const { data } = supabase.storage
            .from('songs-audio')
            .getPublicUrl(filePath);

            console.log('[Audio] ✓ Public URL generated:', data.publicUrl);

            const { error: updateError } = await supabase
            .from('songs')
            .update({ mp4song: data.publicUrl })
            .eq('id', songId);

            if (updateError) throw updateError;
            console.log('[Audio] ✓ mp4song field updated in songs table');

            const updated = songs.map(song => song.id === songId ? {...song, mp4song: data.publicUrl} : song);
            setSongs(updated)
            await saveToCache(updated);
            console.log('[Audio] Local state and cache updated');

            return data.publicUrl;

        } catch (err: any) {
            console.error('[Audio] Upload failed:', err.message);
            return null;
        }
        };


        
    return (
        //returns this broadcasts with the values to every component below in the tree
       // children - whatever wrapped inside the <SongProvider> in layout.tsx (RootLayoutInner contains entire app)
       <SongsContext.Provider value={{songs, loading, error, refetch: fetchSongs, addSong, addLyrics, addReviews, deleteSong, uploadAudio }}>
            {children} 
        </SongsContext.Provider>
    )
}

//that means, any component that calls useSongs() gets access to these
export const useSongs = () => useContext(SongsContext);