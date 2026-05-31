// app/(songs)/[id]/review.tsx
import { useGlobalSearchParams, router } from 'expo-router';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';
import { useTextTheme } from '@/context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReviewsEditForm } from '@/components';
import { useSongs } from '@/store';

export default function Review() {
  const { id } = useGlobalSearchParams();
  const { ThemeTextStyles } = useTextTheme();

  // find the song based on id
  const { songs, addReviews } = useSongs();
  const song = songs.find(s => s.id === id);

    const [editOpen, setEditOpen] = useState(false);


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

      {/* For review, made standalone scrollview only for review */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewText}>{song?.review ?? 'No review added yet' }</Text>
        </View>
      </ScrollView>

      <ReviewsEditForm
        visible={editOpen}
        song={song}
        onClose={() => setEditOpen(false)}
        onSave={ async (songData) => {
          const { song_theme, review} = songData;
          await addReviews(id as string, song_theme, review);
          setEditOpen(false)
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
    paddingBottom:10,
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
  reviewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 15, 15, 0.26)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    margin: 12,
  },
  reviewText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'left',
    width: '100%',
  },
});