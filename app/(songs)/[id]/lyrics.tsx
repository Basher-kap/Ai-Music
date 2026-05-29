// app/(songs)/[id]/lyrics.tsx
import { useGlobalSearchParams, router } from 'expo-router';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';
import { useTextTheme } from '@/context';
import { SONGS } from '@/models/songs';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LyricsEditForm, MusicPlayer } from '@/components';
import { useSongs } from '@/store';

export default function Lyrics() {
  const { id } = useGlobalSearchParams();
  const { ThemeTextStyles } = useTextTheme();

  // fetches the songs from useSongs and find the song based on id
  const { songs } = useSongs();
  const song = songs.find(s => s.id === id);

  const [editOpen, setEditOpen] = useState(false); //at first, it is no visible

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <Text style={ThemeTextStyles.appTitle} adjustsFontSizeToFit numberOfLines={1} >{song?.title}</Text>
          </View>
          <Text style={ThemeTextStyles.tagline} adjustsFontSizeToFit numberOfLines={1} >{song?.artist}</Text>
        </View>

        <TouchableOpacity style={styles.headerBtn} onPress={() => setEditOpen(true)}>
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

      </View>

      <MusicPlayer/>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.lyricsContainer}>
        {/* split by lines and trim of whitespace for consistent centering */}
        <Text style={styles.lyricsText}>{song?.lyrics ? song.lyrics.split('\n').map(line => line.trim()).join('\n') : 'No lyrics added yet' }</Text>
      </ScrollView>
      
      <LyricsEditForm
        visible={editOpen} //state to appear the form
        song={song} //gets the song from its id
        onClose={() => setEditOpen(false)} //when pressed, sets to false to make it not visible now
        onSave={() => setEditOpen(false)}
        onDelete={() => setEditOpen(false)}
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
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    width: '100%', //to use full width of container
  },
});