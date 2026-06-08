// app/(tabs)/songs.tsx
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTextTheme } from '@/context';
import { LinearGradient } from 'expo-linear-gradient';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';
import { useSongs } from '@/store';

import { useState } from 'react';
import { RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddSongForm, EmptyState, SongListSkeleton } from '@/components';

export default function Songs() {
  const { ThemeTextStyles } = useTextTheme();

  const { songs, loading, error, addSong, refetch } = useSongs();
  const [ search, setSearch] = useState('');

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase())
  );

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
          <Text style={[ThemeTextStyles.appTitle]}>Ai Music</Text>
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
          
          <TouchableOpacity onPress={() => setEditOpen(true)}>
            <LinearGradient
              colors={['rgb(255, 255, 255)', 'rgb(255, 255, 255)', 'rgba(0,0,0,0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButton}
            >
              <Ionicons name="add" size={28} color="#000000" />
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
            renderItem={({ item: songItem }) => { //now calls it with an object that has an item property
                return (
                  <View style={[styles.songCard]}>
                    
                    <TouchableOpacity style={{ flexDirection: 'column', gap: 4, flex: 1 }}
                      onPress={() => router.push({ pathname: '/(songs)/[id]/lyrics', params: { id: songItem.id } })}
                    >
                      <Text style={styles.songTitle}>{songItem.title}</Text>
                      <Text style={styles.songArtist}>{songItem.artist}</Text>
                    </TouchableOpacity>
          
                  </View>
                );
            }}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
