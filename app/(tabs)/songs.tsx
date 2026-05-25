// app/(tabs)/songs.tsx
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useTextTheme } from '@/context';
import { LinearGradient } from 'expo-linear-gradient';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant/layout';
import { SONGS } from '@/models/songs';

import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Songs() {
  const { ThemeTextStyles } = useTextTheme();

  const [search, setSearch] = useState('');
  const filteredSongs = SONGS.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase())
  );


  const  [openMenuId, setOpenMenuId] = useState<string | null>(null);


  return (
    <TouchableWithoutFeedback onPress={() => setOpenMenuId(null)}>
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
          <TouchableOpacity onPress={() => {}}>
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

        
        <FlatList data={filteredSongs} //get the filtered data
          keyExtractor={(songItem) => songItem.id} //to track the data with unique id for use
          contentContainerStyle={styles.listContent} //for managing the gap between items
          style={styles.body}
          renderItem={({ item: songItem }) => ( //now calls it with an object that has an item property
            <View style={styles.songCard}>
              
              <TouchableOpacity  style={{ flexDirection: 'column', gap: 4, flex: 1 }}
                onPress={() => {}}>
                    <Text style={styles.songTitle}>{songItem.title}</Text>
                    <Text style={styles.songArtist}>{songItem.artist}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => 
                setOpenMenuId(openMenuId === songItem.id ? null : songItem.id)}>
                <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {openMenuId === songItem.id && (
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => {}}>
                    <Ionicons name="pencil-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.dropdownText}>Rename</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.dropdownItem} onPress={() => {}}>
                    <Ionicons name="trash-outline" size={16} color="#ff4444" />
                    <Text style={[styles.dropdownText, { color: '#ff4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            )}

            </View>
          )}
        />

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    overflow: 'hidden',


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
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 4,
    minWidth: 130,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
