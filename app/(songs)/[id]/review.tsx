// app/(songs)/[id]/review.tsx
import { useGlobalSearchParams } from 'expo-router';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant/layout';
import { useTextTheme } from '@/context';
import { SONGS } from '@/models/songs';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function Review() {
  const { id } = useGlobalSearchParams();
  const { ThemeTextStyles } = useTextTheme();

  // find the song based on id
  const song = SONGS.find(s => s.id === id);

  return (
    
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={ThemeTextStyles.appTitle}>{song?.title}</Text>
        <Text style={ThemeTextStyles.tagline}>{song?.artist}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

        {/* For review, made standalone scrollview only for review */}
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.reviewContainer}>
                <Text style={styles.reviewText}>{song?.review}</Text>
            </View>
        </ScrollView>


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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    },
 actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
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