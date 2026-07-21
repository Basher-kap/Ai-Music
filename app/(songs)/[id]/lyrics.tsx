// app/(songs)/[id]/lyrics.tsx
import { LyricsEditForm, MusicPlayer } from '@/components';
import type { MusicPlayerHandle } from '@/components'; 
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';
import { useButtonTheme, useTextTheme, useTextContainerTheme } from '@/context';
import { useSongs } from '@/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setAudioModeAsync } from 'expo-audio';
import { Observe } from 'expo-observe';
import { router, useFocusEffect, useGlobalSearchParams, useNavigation } from 'expo-router'; 
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Lyrics() {
  const { id } = useGlobalSearchParams();
  const { ThemeTextStyles } = useTextTheme();
  const { ThemeButtonStyles } = useButtonTheme();
  const { ThemeTextContainerStyles } = useTextContainerTheme();
  const navigation = useNavigation(); 

  // fetches the songs from useSongs and find the song based on id
  const { songs, addLyrics, deleteSong, uploadAudio } = useSongs();
  const song = songs.find(s => s.id === id);

  const [editOpen, setEditOpen] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null); // handle to call MusicPlayer.stop()

  useFocusEffect(
    useCallback(() => {
      const stopAllAudio = async () => {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: 'doNotMix', 
        });
      };
      stopAllAudio();
      return () => {};
    }, [])
  );

  //stop music only when the whole "(songs)" group loses focus in the but not on tab switches within this group (Review tab)
  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;
    const unsubscribe = parent.addListener('blur', () => {
      musicPlayerRef.current?.stop();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          style={[styles.headerBtn, ThemeButtonStyles.headerBtn]}
          onPress={() => {
            musicPlayerRef.current?.stop(); //instant stop, don't wait for blur event
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <Text style={ThemeTextStyles.appTitle} adjustsFontSizeToFit numberOfLines={1} >{song?.title}</Text>
          </View>
          <Text style={ThemeTextStyles.tagline} adjustsFontSizeToFit numberOfLines={1} >{song?.artist}</Text>
        </View>

        <TouchableOpacity style={[styles.headerBtn, ThemeButtonStyles.headerBtn]} onPress={() => setEditOpen(true)}>
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

      </View>

      <MusicPlayer ref={musicPlayerRef} uri={song?.localUri ?? song?.mp4song ?? null}/> 

      <ScrollView showsVerticalScrollIndicator={false} style={[styles.lyricsContainer, ThemeTextContainerStyles.lyricsContainer]}>
        {/* split by lines and trim of whitespace for consistent centering */}
        { song?.lyrics ? song.lyrics.split('\n').map((line, index) => (
           <Text key={index} style={styles.lyricsText}>
              {line.trim() === '' ? ' ' : line.trim()}
           </Text>
        )) : <Text style={styles.lyricsText}>No lyrics added yet</Text>
        }
      </ScrollView>
      
      <LyricsEditForm
        visible={editOpen} //state to appear the form
        song={song} //gets the song from its id
        onClose={() => setEditOpen(false)} //when pressed, sets to false to make it not visible now
        onSave={async (songData) => {
            const { title, artist, lyrics } = songData;
            try {
              await addLyrics(id as string, title, artist, lyrics);
              Observe.logEvent('lyrics_edited', {
                attributes: { char_count: lyrics.length },
              });
              setEditOpen(false);
            } catch (err: any) {
              Observe.logEvent('lyrics_edit_failed', {
                severity: 'error',
                body: err.message,
              });
            }
          }}
        onDelete={async() => {
          await deleteSong(id as string);
          setEditOpen(false);
          router.replace('/(tabs)/songs');
        }}
        onUploadAudio={async (fileUri, fileName) => {
          await uploadAudio(id as string, fileUri, fileName);
        }}
      />
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PADDING_TOP,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingBottom: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(15, 15, 15, 0.26)',
    borderRadius: 80,
  },
  headerBtn: {
    padding: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lyricsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 15, 15, 0.26)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    margin: 12,
  },
  lyricsText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    width: '100%', //to use full width of container
    minHeight: 24,
  },
});