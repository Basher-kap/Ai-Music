// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import { BgImgThemeProvider, useBgImgTheme, themeImages } from '../context/BgImgContext';

const defaultBackgroundImage = require('../assets/bg-images/nostalgia_theme4.jpg');

function RootLayoutInner() {
  const { activeTheme } = useBgImgTheme();
  const backgroundImage = activeTheme ? themeImages[activeTheme] : defaultBackgroundImage;

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
    <BgImgThemeProvider>
      <RootLayoutInner />
    </BgImgThemeProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});