// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated, ImageBackground, StyleSheet } from 'react-native';
import { useBgImg, ThemeProvider, useTheme } from '@/context';
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
import { useEffect, useRef, useState } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider, SongsProvider, useAuth } from '@/store';
import { router } from 'expo-router';

function RootLayoutInner() {
  const backgroundImage = useBgImg();
  const { activeTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentImage, setCurrentImage] = useState(backgroundImage);
  const [nextImage, setNextImage] = useState(backgroundImage);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    setNextImage(backgroundImage);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, 
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentImage(backgroundImage);
    });
  }), [activeTheme];

  useEffect(() => {
      if (authLoading) return;

      console.log('[Route] session:', session?.user?.email ?? 'none', '| authLoading:', authLoading);

      const timer = setTimeout(() => {
        if (!session) {
          router.replace('/login');
        } else {
          router.replace('/(tabs)');
        }
      }, 500); // ← small delay to let the stack mount first

    return () => clearTimeout(timer);
  }, [session, authLoading]);

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  const [loadFonts] = useFonts(
    {
      Marcellus_400Regular, PlaywriteGBS_400Regular, DancingScript_600SemiBold, Fredoka_600SemiBold, 
      MedievalSharp_400Regular, Syne_600SemiBold, Syne_700Bold, RussoOne_400Regular, MetalMania_400Regular
    }
  )

  if (!loadFonts || authLoading) return (
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
        <Animated.View 
          style={[
            StyleSheet.absoluteFillObject,
            { opacity: fadeAnim }
          ]}
        >
          <ImageBackground
            source={nextImage}
            style={styles.background}
            resizeMode="cover"
          />
        </Animated.View>
        
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="private/admin" options={{headerShown: false, contentStyle: {backgroundColor: 'transparent'}, animation:'fade'}} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_left' }} />
          <Stack.Screen name="(songs)" options={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'slide_from_right' }} />
          <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
          <Stack.Screen name="generate-lyrics-format" options={{headerShown: false, contentStyle: {backgroundColor: 'transparent'}, animation:'fade'}} />
          <Stack.Screen name="news-feed" options={{headerShown: false, contentStyle: {backgroundColor: 'transparent'}, animation:'fade'}} />
        </Stack>
      </ImageBackground>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SongsProvider>
          <RootLayoutInner/>
        </SongsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});