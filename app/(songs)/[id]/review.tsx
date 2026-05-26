// app/(songs)/[id]/review.tsx
import { useGlobalSearchParams } from 'expo-router';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant/layout';
import { useTextTheme } from '@/context';
import { SONGS } from '@/models/songs';
import { View, Text, StyleSheet } from 'react-native';

export default function Review() {
  const { id } = useGlobalSearchParams();
  const { ThemeTextStyles } = useTextTheme();

  // find the song based on id
  const song = SONGS.find(s => s.id === id);

  console.log('id from params:', id);
  console.log('song found:', song);

  return (
    
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={ThemeTextStyles.appTitle}>{song?.title}</Text>
        <Text style={ThemeTextStyles.tagline}>{song?.artist}</Text>
      </View>

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
});