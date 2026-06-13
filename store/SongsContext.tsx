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

    //FETCH SONGS - LOCAL-FIRST then sybc with Supabase in the background

    //function to get the data
    const fetchSongs = async () => {
        setError(null); //then sends no error yet

        const { data: { user } } = await supabase.auth.getUser();

        logger.log('[Songs] Fetching songs for user:', user?.email ?? 'none');

        if (!user) {
            setSongs([]);
            setLoading(false);
            return;
        }

        //Step 1 Load From cache first for instant display
        const cached = await loadFromCache();
        if (cached.length > 0) {
            setSongs(cached);
            setLoading(false); // this shows cached data immediately
            console.log('[Songs] ✓ Loaded', cached.length, 'songs from cache');
        } else {
            setLoading(true); // if no chache, show spinner until Supabase responds
        }

        //Step 2 feth fresh data from supabase
        try {
            const { data, error } = await supabase
            .from('songs') //get a table "songs"
            .select('*') //* means select all data in the 'songs'
            .eq('user_id', user.id) //only fetch the user's songs
            .order('created_at' , {ascending: false}); //newest at the top
            
            if (error) throw error;

            setSongs(data as Song[]);
            await saveToCache(data as Song[]); //update cache with fresh data
            console.log('[Songs] ✓ Fetched', data.length, 'songs from Supabase');
        } catch (err: any) {
            console.error('[Songs] Fetch error:', err.message);
            if (cached.length === 0) {
                setError (err.message);
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
          logger.log('Adding song:', title, artist, song_theme);

          //  need the current user's ID to associate the song
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('No user logged in. Cannot add song.');
            return;
        }
        
        const { data, error } = await supabase
            .from('songs')
            .insert([{ title, artist, song_theme, user_id: user.id }]) //a query to add a song in a table
            .select()
            .single();

            if (error) {
                console.error('[Songs] Error adding song:', error.message);
                return;
            }

            // we have the new row — update local state and cache directly
            const updated = [ data as Song, ...songs];
            setSongs(updated);
            await saveToCache(updated);
            console.log('[Songs] Song added and cache updated');
    };

    const addLyrics = async (id: string, title: string, artist: string, lyrics: string ) => {

        const { error } = await supabase
            .from('songs')
            .update({ title, artist, lyrics }).eq('id',id); 

        if ( error ) throw error;

        // we onlye update the changed song in local state
        const updated = songs.map(song => song.id === id ? {...song, title, artist, lyrics } : song);
        setSongs(updated);
        await saveToCache(updated);
        console.log('[Songs] Lyrics added and cache updated');
    };

    const addReviews = async (id: string, song_theme: string[], review: string ) => {

        const { error } = await supabase
            .from('songs')
            .update({ song_theme, review }).eq('id',id); 

        if ( error ) throw error;

        // same as lyrics
        const updated = songs.map( song => song.id === id ? { ...song, song_theme, review } : song );
        setSongs(updated);
        await saveToCache(updated);
        console.log('[Songs] Review updated and cached updated');
    };

    const deleteSong = async (id: string) => {
        setSongs(prev => prev.filter(s => s.id !==  id)) //instant UI update
        logger.log('Deleting song:', id);
          
        const { error } = await supabase
        .from('songs')
        .delete().eq('id', id);

        if ( error ) throw error;

        const updated = songs.filter(song => song.id !== id);
        setSongs(updated);
        await saveToCache(updated);
        console.log('[Songs] Song deleted and cache updated');
    };

    const uploadAudio = async (songId: string, fileUri: string, fileName: string): Promise<string | null> => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
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