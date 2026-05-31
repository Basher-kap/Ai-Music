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
});

//fetching of data
export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    //function to get the data
    const fetchSongs = async () => {
        setLoading(true); //informs that is loading
        setError(null); //then sends no error yet

        const { data, error } = await supabase
        .from('songs') //get a table "songs"
        .select('*') //* means select all data in the 'songs'
        .order('created_at' , {ascending: false}); //newest at the top
        
        if (error) {
            setError(error.message);
        } else {
            //checks the data (which got from the supabase) if matches the Song[] (its strcuture)
            setSongs (data as Song[]);
        }

        setLoading(false);
    };
        
   //run this when the app renders (to avoid continuous running a fetch data)
    useEffect(() => {
        fetchSongs();
    }, []);

    const addSong = async (title: string, artist: string, song_theme: string[]) => {
          console.log('Adding song:', title, artist, song_theme);

        const { error } = await supabase
            .from('songs')
            .insert([{ title, artist, song_theme}]); //a query to add a song in a table

        if ( error ) {
            console.error('Error adding song:' , error.message)
        } else {
            await fetchSongs(); //fetching the songs after adding, usually updates
        }
    };

    const addLyrics = async (id: string, title: string, artist: string, lyrics: string ) => {
          console.log('Adding lyrics:', id, title, artist, lyrics);

        const { error } = await supabase
            .from('songs')
            .update({ title, artist, lyrics }).eq('id',id); 

        if ( error ) {
            throw error;
        } else {
            await fetchSongs(); 
        }
    };

        
    return (
        //returns this broadcasts with the values to every component below in the tree
       // children - whatever wrapped inside the <SongProvider> in layout.tsx (RootLayoutInner contains entire app)
       <SongsContext.Provider value={{songs, loading, error, refetch: fetchSongs, addSong, addLyrics }}>
            {children} 
        </SongsContext.Provider>
    )
}

//that means, any component that calls useSongs() gets access to these
export const useSongs = () => useContext(SongsContext);