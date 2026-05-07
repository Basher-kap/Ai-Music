// app/(songs)/lyrics.tsx
import { Text, View, StyleSheet } from 'react-native';

export default function Lyrics() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Song 1's lyrics will be displayed here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
