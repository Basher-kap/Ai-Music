// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import { useBgImg } from '../context/BgImgContext';
import { ThemeProvider } from '@/context/ThemeContext';

import { useFonts } from 'expo-font';
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus';
import { PlaywriteITModerna_400Regular } from '@expo-google-fonts/playwrite-it-moderna';

import { ActivityIndicator, View } from 'react-native';

function RootLayoutInner() {
  const backgroundImage = useBgImg();

  const [loadFonts] = useFonts(
    {
      Marcellus_400Regular, PlaywriteITModerna_400Regular,
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