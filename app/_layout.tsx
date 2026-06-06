// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet } from 'react-native';
import { useBgImg, ThemeProvider } from '@/context';
import { useFonts } from 'expo-font';
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus';
import { PlaywriteGBS_400Regular } from '@expo-google-fonts/playwrite-gb-s';
import { DancingScript_600SemiBold } from '@expo-google-fonts/dancing-script';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { MedievalSharp_400Regular } from '@expo-google-fonts/medievalsharp';
import { Syne_600SemiBold, Syne_700Bold } from '@expo-google-fonts/syne';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { MetalMania_400Regular } from '@expo-google-fonts/metal-mania'; 

import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider, SongsProvider, useAuth } from '@/store';
import { router } from 'expo-router';

function RootLayoutInner() {
  const backgroundImage = useBgImg();
  const { session, loading } = useAuth();

  useEffect(() => {
     if (loading) return;

    if (!session) {
      // Because no session means user is not logged in
      router.replace('/login');
    } else {
      // Because session exists means user is logged in
      router.replace('/(tabs)');
    }

    NavigationBar.setVisibilityAsync('hidden');
  }, [session, loading]);

  const [loadFonts] = useFonts(
    {
      Marcellus_400Regular, PlaywriteGBS_400Regular, DancingScript_600SemiBold, Fredoka_600SemiBold, 
      MedievalSharp_400Regular, Syne_600SemiBold, Syne_700Bold, RussoOne_400Regular, MetalMania_400Regular
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
            animation: 'fade', //apply fade animation as default to all tabs in a Stack
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false,  animation: 'slide_from_left' }} />
          <Stack.Screen name="(songs)" options={{ headerShown: false, contentStyle: {backgroundColor: 'transparent'}, animation: 'slide_from_right' }} />
        </Stack>
      </ImageBackground>
    </>
  );
}

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <SongsProvider userId={user?.id ?? null}>
      {children}
    </SongsProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProvidersWrapper>
          <RootLayoutInner/>
        </ProvidersWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});