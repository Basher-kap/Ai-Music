// app/(songs)/[id]/review.tsx
import { useGlobalSearchParams, router } from 'expo-router';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant/layout';
import { useTextTheme } from '@/context';
import { SONGS } from '@/models/songs';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReviewsEditForm } from '@/components';

export default function Review() {
  const { id } = useGlobalSearchParams();
  const { ThemeTextStyles } = useTextTheme();

  // find the song based on id
  const song = SONGS.find(s => s.id === id);

    const [editOpen, setEditOpen] = useState(false);


  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.titleRow}>
            <Text style={ThemeTextStyles.appTitle}>{song?.title}</Text>
          </View>
          <Text style={ThemeTextStyles.tagline}>{song?.artist}</Text>
        </View>
          
        <TouchableOpacity style={styles.headerBtn} onPress={() => setEditOpen(true)}>
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

      </View>

      {/* For review, made standalone scrollview only for review */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewText}>{song?.review}</Text>
        </View>
      </ScrollView>

      <ReviewsEditForm
        visible={editOpen}
        song={song}
        onClose={() => setEditOpen(false)}
        onSave={() => setEditOpen(false)}
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
    backgroundColor: 'rgba(15, 15, 15, 0.26)',
    paddingBottom: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerBtn: {
    padding: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: '50%',
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