// app/(tabs)/songs.tsx
import { Text, View, StyleSheet } from 'react-native';

export default function Songs() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This page is the song list</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
