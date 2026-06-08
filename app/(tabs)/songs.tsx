// app/(tabs)/songs.tsx
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTextTheme, useTheme, useButtonTheme } from '@/context';
import { LinearGradient } from 'expo-linear-gradient';
import { HEADER_HEIGHT, HEADER_PADDING_TOP, THEME_ACCENTS, ThemeKey } from '@/constant';
import { useSongs } from '@/store';

import { useState } from 'react';
import { RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddSongForm, EmptyState, SongListSkeleton } from '@/components';

import {ADD_BUTTON_GRADIENTS } from '@/context/ButtonContext';

export default function Songs() {
  const { activeTheme } = useTheme();
  const { ThemeTextStyles } = useTextTheme();
  const { ThemeButtonStyles } = useButtonTheme();

  const { songs, loading, error, addSong, refetch } = useSongs();
  const [ search, setSearch] = useState('');

  const filteredSongs = songs.filter(song => {
    const matchesSearch = 
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase());

    const matchesTheme = song.song_theme?.includes(activeTheme);

    return matchesSearch && matchesTheme;
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [editOpen, setEditOpen] = useState(false);

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#ff4444' }}>Failed to load songs.</Text>
    </View>
  );

  return (
      <View style={styles.container}>
      
        <View style={styles.header}>
          <Text style={[ThemeTextStyles.appTitle]}>Your Songs</Text>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search songs..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity
            onPress={() => setEditOpen(true)}
            activeOpacity={0.8}
            style={[styles.addButton, ThemeButtonStyles.addButton]}  // ← shadows here
          >
            <LinearGradient
              colors={ADD_BUTTON_GRADIENTS[activeTheme]}
              start={{ x: 0, y: 0.15 }}
              end={{ x: 1, y: 0.85 }}
              style={[styles.addButton, ThemeButtonStyles.addButton]}
            >
              <Ionicons name="add" size={26} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
          
        </View>

        {/*while loading, show skeleton-like view */}
        {loading ? <SongListSkeleton /> :
          filteredSongs.length === 0 && search === ''
          ? <EmptyState onAddSong={() => setEditOpen(true)} />
            : filteredSongs.length === 0 && search !== ''
              ? // diff message for Search empty state
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="search-outline" size={40} color="rgba(255,255,255,0.2)" />
                  <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontSize: 14 }}>
                    No songs match "{search}"
                  </Text>
                </View>
          :
          <FlatList 
            data={filteredSongs} //get the filtered data
            keyExtractor={(songItem) => songItem.id} //to track the data with unique id for use
            contentContainerStyle={styles.listContent} //for managing the gap between items
            showsVerticalScrollIndicator={false}
            style={styles.body}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#FFFFFF"
                colors={['#050505']}
              />
            }
            renderItem={({ item: songItem }) => (
              <View style={styles.songCard}>
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => router.push({ pathname: '/(songs)/[id]/lyrics', params: { id: songItem.id } })}
                >
                  {/* Left — title and artist */}
                  <View style={{ flex: 1, flexDirection: 'column', gap: 4 }}>
                    <Text style={styles.songTitle}>{songItem.title}</Text>
                    <Text style={styles.songArtist}>{songItem.artist}</Text>
                  </View>

                  {/* Right — theme chips */}
                  {songItem.song_theme?.length > 0 && (
                    <View style={styles.chipRow}>
                      {songItem.song_theme.map(theme => (
                        <View 
                          key={theme} 
                          style={[styles.chip, { backgroundColor: THEME_ACCENTS[theme as ThemeKey] }]}
                        >
                          <Text style={styles.chipText}>{theme}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                </TouchableOpacity>
              </View>
            )}
          />
        } 

        <AddSongForm
          visible={editOpen}
          onClose={() => setEditOpen(false)} 
          onSave={async (songData) => {
            const { title, artist, themes } = songData;
            await addSong(title, artist, themes);
            setEditOpen(false);
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
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end', 
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    borderRadius: 20,
    margin: 12,
    padding: 5,
  },
  listContent: {
    padding: 12,
    gap: 5,
  },
  songCard: {
    flexDirection: 'row',        
    alignItems: 'center',        
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 15, 15, 0.26)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  songArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  actionRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchInput: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'column',  
    gap: 4,
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'capitalize',
  },
});
