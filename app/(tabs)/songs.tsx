// app/(tabs)/songs.tsx
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTextTheme, useTheme, useButtonTheme, useSearchBarTheme } from '@/context';
import { LinearGradient } from 'expo-linear-gradient';
import { HEADER_HEIGHT, HEADER_PADDING_TOP, THEME_ACCENTS, ThemeKey } from '@/constant';
import { useSongs } from '@/store';

import { useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AddSongForm, EmptyState, SongListSkeleton } from '@/components';

import {ADD_BUTTON_GRADIENTS } from '@/context/ButtonContext';
import DebugLog from '@/components/DebugLog';


export default function Songs() {
  const { activeTheme } = useTheme();
  const { ThemeTextStyles } = useTextTheme();
  const { ThemeButtonStyles } = useButtonTheme();4
  const { ThemeSearchBarStyles } = useSearchBarTheme();

  const { songs, loading, error, addSong, refetch, debugLog } = useSongs();
  const [search, setSearch] = useState('');
  const [filterByTheme, setFilterByTheme] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setFilterByTheme(true);
  }, [activeTheme]);

  const filteredSongs = songs.filter(song => {
    const matchesSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase());

    const matchesTheme = filterByTheme ? song.song_theme?.includes(activeTheme) : true;

    return matchesSearch && matchesTheme;
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch {
      console.log('[Songs] Refresh failed — offline');
    } finally {
      setRefreshing(false);
    }
  };

  const [editOpen, setEditOpen] = useState(false);

  const renderBody = () => {
    // Error with no cached data — show refreshable error screen
    if (error) {
      return (
        <FlatList
          data={[]}
          renderItem={null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FFFFFF"
              colors={['#050505']}
            />
          }
          ListEmptyComponent={
            <View style={styles.errorContainer}>
              <Ionicons name="cloud-offline-outline" size={40} color="rgba(255,255,255,0.25)" />
              <Text style={styles.errorText}>Failed to load songs.</Text>
              <Text style={styles.errorSub}>Pull down to try again.</Text>
            </View>
          }
        />
      );
    }

    if (loading) return <SongListSkeleton />;

    if (filteredSongs.length === 0 && search === '') {
      return <EmptyState onAddSong={() => setEditOpen(true)} />;
    }

    if (filteredSongs.length === 0 && search !== '') {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="search-outline" size={40} color="rgba(255,255,255,0.2)" />
          <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontSize: 14 }}>
            No songs match "{search}"
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredSongs}
        keyExtractor={(songItem) => songItem.id}
        contentContainerStyle={styles.listContent}
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
                {/* Because pending songs haven't synced yet */}
                {songItem.pending && (
                  <Ionicons name="cloud-upload-outline" size={12} color="rgba(255,255,255,0.4)" />
                )}
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
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={[ThemeTextStyles.appTitle]}>Your Songs</Text>
      </View>

      <View style={styles.actionRow}>
        <LinearGradient
          colors={ThemeSearchBarStyles.gradientColors}
          start={ThemeSearchBarStyles.gradientStart}
          end={ThemeSearchBarStyles.gradientEnd}
          style={[styles.searchContainer, ThemeSearchBarStyles.container]}
        >
          <TextInput
            placeholder="Search songs..."
            placeholderTextColor={ThemeSearchBarStyles.placeholderColor}
            style={[styles.searchInput, ThemeSearchBarStyles.input]}
            value={search}
            onChangeText={setSearch}
          />
        </LinearGradient>

          <TouchableOpacity style={[styles.themeToggle, ThemeButtonStyles.themeToggle,
              filterByTheme && ThemeButtonStyles.themeToggleActive,
            ]}
            onPress={() => setFilterByTheme(prev => !prev)}>
            <Ionicons
              name={filterByTheme ? 'color-palette' : 'color-palette-outline'} size={16}
              color={filterByTheme ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} />
          </TouchableOpacity>

        <TouchableOpacity
            onPress={() => setEditOpen(true)}
            activeOpacity={0.8}
            style={[styles.addButton, ThemeButtonStyles.addButton]}>
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

      {renderBody()}

      <AddSongForm
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={async (songData) => {
          try {
            await addSong(songData.title, songData.artist, songData.themes);
            setEditOpen(false);
          } catch (err: any) {
            Alert.alert('Cannot Add Song', err.message);
          }
        }}
      />

        <DebugLog logs={debugLog} />
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
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    alignItems: 'center',
    justifyContent: 'center',
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    gap: 8,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 15,
    marginTop: 8,
  },
  errorSub: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
  },
});