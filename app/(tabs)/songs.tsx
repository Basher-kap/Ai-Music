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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'center',   
  },
  textTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
