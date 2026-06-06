// store/SongsContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Song } from '@/models/songs';
import { supabase } from '@/utils/supabase';

// a strcuture of data that the fetching the songs will use
type SongsContextType = {
  songs: Song[]; // declares this as array
  loading: boolean; //notes if data being fetched?
  error: string | null; // either carries an error message string or none
  refetch: () => void;
  addSong: (title: string, artist: string, song_theme: string[]) => Promise<void>; 
  addLyrics: (id: string, title: string, artist: string, lyrics: string) => Promise<void>;
  addReviews: (id: string, song_theme: string[], review: string) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
};

// creates a container to hold data and share it across the app, that data is the built SongsContextType
const SongsContext = createContext<SongsContextType>({
  //these are the initial state
  songs: [], //starts an empty list first
  loading: true,
  error: null,
  refetch: () => {},
  addSong: async () => {},
  addLyrics: async () => {},
  addReviews: async () => {},
  deleteSong: async () => {},
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

        console.log('[Songs] Fetching songs for user:', user?.email ?? 'none');

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
        
        console.log('fetched order:', data?.map(s => s.title));
        
        if (error) {
            console.error('[Songs] Fetch error:', error.message);
            setError(error.message);
        } else {
            console.log('[Songs] ✓ Fetched', data.length, 'songs for', user.email);
            console.log('[Songs] Song titles:', data.map(s => s.title));
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
            console.log('[Songs] Cleared songs — signed out');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const addSong = async (title: string, artist: string, song_theme: string[]) => {
          console.log('Adding song:', title, artist, song_theme);

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
            console.error('Error adding song:' , error.message)
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
        console.log('Deleting song:', id);
          
        const { error } = await supabase
        .from('songs')
        .delete().eq('id', id);

        if ( error ) {
            throw error;
        } else {
            await fetchSongs(); 
        }
    }

        
    return (
        //returns this broadcasts with the values to every component below in the tree
       // children - whatever wrapped inside the <SongProvider> in layout.tsx (RootLayoutInner contains entire app)
       <SongsContext.Provider value={{songs, loading, error, refetch: fetchSongs, addSong, addLyrics, addReviews, deleteSong }}>
            {children} 
        </SongsContext.Provider>
    )
}

//that means, any component that calls useSongs() gets access to these
export const useSongs = () => useContext(SongsContext);