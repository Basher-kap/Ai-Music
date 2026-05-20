// app/(tabs)/index.tsx
import { Text, View,  StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Index() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/theme" style={styles.button}>
        Go to Theme screen
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
