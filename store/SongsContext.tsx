// store/SongsContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Song } from '@/models/songs';
import { supabase } from '@/utils/supabase';

// a strcuture of data that the fetching the songs will use
type SongsContextType = {
  songs: Song[]; // declares this as array
  loading: boolean; //notes if data being fetched?
  error: string | null; // either carries an error message string or none
};

// creates a container to hold data and share it across the app, that data is the built SongsContextType
const SongsContext = createContext<SongsContextType>({
  //these are the initial state
  songs: [], //starts an empty list first
  loading: true,
  error: null,
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

        console.log('Fetching songs from Supabase...');

        const { data, error } = await supabase
        .from('songs') //get a table "songs"
        .select('*') //* means select all data in the 'songs'
        .order('created_at' , {ascending: false}); //newest at the top
        
        console.log('data:', data);
        console.log('error:', error);

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

        
    return (
        //returns this broadcasts with the values to every component below in the tree
       // children - whatever wrapped inside the <SongProvider> in layout.tsx (RootLayoutInner contains entire app)
       <SongsContext.Provider value={{songs, loading, error }}>
            {children} 
        </SongsContext.Provider>
    )
}

//that means, any component that calls useSongs() gets access to these
export const useSongs = () => useContext(SongsContext);