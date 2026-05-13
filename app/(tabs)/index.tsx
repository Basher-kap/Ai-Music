// app/(tabs)/index.tsx
import { Text, View,  StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useTextTheme } from '@/context/TextContext';

export default function Index() {
  const { textColor } = useTextTheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: textColor }}>Home screen</Text>
      <Link href="/theme" style={styles.button}>
        Go to Theme screen
      </Link>
    </View>
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
