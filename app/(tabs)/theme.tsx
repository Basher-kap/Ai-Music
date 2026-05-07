// app/(tabs)/theme.tsx
import { Text, View, StyleSheet } from 'react-native';

export default function Theme() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Check all your favorite songs!</Text>
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
