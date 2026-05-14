// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import { useBgImg } from '../context/BgImgContext';
import { ThemeProvider } from '@/context/ThemeContext';

import { useFonts } from 'expo-font';
import { ZenOldMincho_900Black } from '@expo-google-fonts/zen-old-mincho';

import { ActivityIndicator, View } from 'react-native';

function RootLayoutInner() {
  const backgroundImage = useBgImg();

  const [loadFonts] = useFonts(
    {
      ZenOldMincho_900Black,
    }
  )

if (!loadFonts) return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
    <ActivityIndicator size="large" color="#7EC8A0" />
  </View>
);
  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground
        source={backgroundImage}
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});