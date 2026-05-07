// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground
        source={require('../assets/bg-images/nostalgia_theme.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }, 
            animation: 'none',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});