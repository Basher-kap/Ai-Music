// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import { useBgImg } from '../context/BgImgContext';
import { ThemeProvider } from '@/context/ThemeContext';

import { useFonts } from 'expo-font';
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus';
import { PlaywriteGBS_400Regular } from '@expo-google-fonts/playwrite-gb-s';
import { DancingScript_600SemiBold } from '@expo-google-fonts/dancing-script';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { AlmendraDisplay_400Regular } from '@expo-google-fonts/almendra-display';
import { MedievalSharp_400Regular } from '@expo-google-fonts/medievalsharp';
import { Syne_600SemiBold, Syne_700Bold } from '@expo-google-fonts/syne';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { MetalMania_400Regular } from '@expo-google-fonts/metal-mania'; 

import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

function RootLayoutInner() {
  const backgroundImage = useBgImg();

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  const [loadFonts] = useFonts(
    {
      Marcellus_400Regular, PlaywriteGBS_400Regular, DancingScript_600SemiBold, Fredoka_600SemiBold, 
      AlmendraDisplay_400Regular, MedievalSharp_400Regular, Syne_600SemiBold, Syne_700Bold, RussoOne_400Regular, MetalMania_400Regular
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