// app/(tabs)/songs.tsx
import { Text, View, StyleSheet } from 'react-native';
import { useTextTheme } from '@/context/TextContext';

export default function Songs() {
  const { ThemeTextStyles } = useTextTheme();

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <Text style={[ThemeTextStyles.appTitle]}>Ai Music</Text>
      </View>

      <View style={styles.body}>
        <Text style={[ThemeTextStyles.color]}>This page is the song list</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',   
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
