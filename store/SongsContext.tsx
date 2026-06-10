// store/SongsContext.tsx
import { Song } from '@/types/songs';
import { logger } from '@/utils/logger';
import { supabase } from '@/utils/supabase';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

    //function to get the data
    const fetchSongs = async () => {
        setLoading(true); //informs that is loading
        setError(null); //then sends no error yet

        const { data: { user } } = await supabase.auth.getUser();

        logger.log('[Songs] Fetching songs for user:', user?.email ?? 'none');

        if (!user) {
            setSongs([]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
        .from('songs') //get a table "songs"
        .select('*') //* means select all data in the 'songs'
        .eq('user_id', user.id) //only fetch the user's songs
        .order('created_at' , {ascending: false}); //newest at the top
        
        logger.log('fetched order:', data?.map(s => s.title));
        
        if (error) {
            console.error('[Songs] Fetch error:', error.message);
            setError(error.message);
        } else {
            logger.log('[Songs] ✓ Fetched', data.length, 'songs for', user.email);
            logger.log('[Songs] Song titles:', data.map(s => s.title));
            //checks the data (which got from the supabase) if matches the Song[] (its strcuture)
            setSongs (data as Song[]);
        }

        setLoading(false);
    };
        
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            fetchSongs();
            } else if (event === 'SIGNED_OUT') {
            setSongs([]);
            setLoading(false);
            logger.log('[Songs] Cleared songs — signed out');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const addSong = async (title: string, artist: string, song_theme: string[]) => {
          logger.log('Adding song:', title, artist, song_theme);

          //  need the current user's ID to associate the song
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('No user logged in. Cannot add song.');
            return;
        }
        
        const { error } = await supabase
            .from('songs')
            .insert([{ title, artist, song_theme, user_id: user.id }]); //a query to add a song in a table

        if ( error ) {
            throw error;
        } else {
            await fetchSongs(); //fetching the songs after adding, usually updates
        }
    };

    const addLyrics = async (id: string, title: string, artist: string, lyrics: string ) => {

        const { error } = await supabase
            .from('songs')
            .update({ title, artist, lyrics }).eq('id',id); 

        if ( error ) {
            throw error;
        } else {
            await fetchSongs(); 
        }
    };

    const addReviews = async (id: string, song_theme: string[], review: string ) => {

        const { error } = await supabase
            .from('songs')
            .update({ song_theme, review }).eq('id',id); 

        if ( error ) {
            throw error;
        } else {
            await fetchSongs(); 
        }
    };

    const deleteSong = async (id: string) => {
        setSongs(prev => prev.filter(s => s.id !==  id)) //instant UI update
        logger.log('Deleting song:', id);
          
        const { error } = await supabase
        .from('songs')
        .delete().eq('id', id);

        if ( error ) {
            await fetchSongs(); //revert on failure
            throw error;
        } else {
            await fetchSongs(); 
        }
    }

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

            setSongs(prev => prev.map(song =>
            song.id === songId
                ? { ...song, mp4song: data.publicUrl }
                : song
            ));
            console.log('[Audio] ✓ Local state updated');
            console.log('[Audio] ✓ Upload complete for song:', songId);

            return data.publicUrl;

        } catch (err: any) {
            console.error('[Audio] ✗ Upload failed:', err.message);
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