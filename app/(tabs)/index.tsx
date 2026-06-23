// app/(tabs)/index.tsx
import { HEADER_HEIGHT, HEADER_PADDING_TOP, ThemeKey } from '@/constant';
import { useButtonTheme, useTextTheme, useTheme } from '@/context';
import { useAuth } from '@/store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, AppState, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import type { DailySong } from '@/types/settings';

export default function Index() {
  const { ThemeTextStyles } = useTextTheme();
  const { ThemeButtonStyles } = useButtonTheme();
  const { signOut, user, session } = useAuth();

  const [dailySong, setDailySong] = useState<DailySong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const rotation = useRef(new Animated.Value(0)).current;

  const { setActiveTheme } = useTheme();

  // Fetch daily song from settings table
  useFocusEffect(
    useCallback(() => {
      const fetchDailySong = async () => {
        //load from cache first
        try {
          const cached = await AsyncStorage.getItem('daily_song');
          if (cached) {
            setDailySong(JSON.parse(cached));
            console.log('[Home] Daily song loaded from cache');
          }
        }catch {
          console.log('[Home] No daily song cache')
        }

        //fetch from database
        try{
          const { data, error } = await supabase
            .from('settings')
            .select('daily_song_title, daily_song_artist, daily_song_url, daily_song_image, daily_song_theme, updated_at')
            .eq('id', 1)
            .single();

          if (!error && data) {
            setDailySong(data);
            // update cache
            await AsyncStorage.setItem('daily_song', JSON.stringify(data));
            console.log('[Home] Daily song synced from:', data.daily_song_title);          
          }
        } catch (err: any) {
          console.log('[Home] Daily song fetch failed - using cache')
        }
      };
        
      fetchDailySong();
    }, [])
  );

  const isProcessingRef = useRef(false);

  const handleVinylPress = async () => {
    if (!dailySong?.daily_song_url) return;
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      if (dailySong?.daily_song_theme) {
        setActiveTheme(dailySong.daily_song_theme as ThemeKey);
      }

      if (isPlaying) {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setIsPlaying(false);
        console.log('[Home] Music Stopped');
      } else {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: dailySong.daily_song_url },
            { shouldPlay: true }
          );
          soundRef.current = sound;
          setIsPlaying(true);
          console.log('[Home] Playing:', dailySong.daily_song_title);

          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              soundRef.current?.unloadAsync();
              soundRef.current = null;
              setIsPlaying(false);
              console.log('[Home] Finished');
            }
          });
        } catch {
          // Because audio requires internet — show friendly message
          console.log('[Home] Cannot play — no internet connection');
          Alert.alert(
            'No Internet',
            'Daily song requires an internet connection to play.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (err: any) {
      console.error('[Home] Playback error:', err.message);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isPlaying){
      animationRef.current = Animated.loop(
        Animated.timing(rotation, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
      animationRef.current.start();
    } else {
      animationRef.current?.stop();
      rotation.setValue(0);
    }
  }, [isPlaying]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // stop music when app is on background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (soundRef.current){
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          setIsPlaying(false);
          console.log('[Home] Stopped - app backgrounded');
        }
      }
    });
    return () => subscription.remove();
  }, []);

  // stop music when user signed out
  useEffect(() => {
    if(!session && soundRef.current) {
      soundRef.current.stopAsync().then(() => {
        soundRef.current?.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
        console.log('[Home] Stopped - signed out');
      });
    }
  }, [session]);


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={[ThemeTextStyles.appTitle]}>Ai Music</Text>
      </View>

      {/* Vinyl */}
      <View style={styles.vinylSection}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleVinylPress} onLongPress={() => { console.log('[Admin] Long press detected');
        router.navigate('/private/admin');
      }}>
          {/* Glassmorphic Vinyl Shadow Backdrop Ring */}
          <View style={styles.vinylGlowBackdrop}>
            <Animated.View style={[styles.vinyl, { transform: [{ rotate }] }]}>

              {/* Outer ring */}
              <View style={styles.vinylRing} />
              {/* Inner ring */}
              <View style={styles.vinylInnerRing} />

              {/* Daily song image */}
              <View style={styles.vinylCenter}>
                {dailySong?.daily_song_image ? (
                  <Image
                    source={{ uri: dailySong.daily_song_image }}
                    style={styles.vinylCenterImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="musical-note" size={24} color="#FFFFFF" style={styles.centerIconGlow} />
                )}
              </View>

            </Animated.View>
          </View>
    </TouchableOpacity>

        {/* Daily song info below vinyl */}
        {dailySong?.daily_song_title && (
          <View style={styles.dailySongInfo}>
            <Text style={styles.dailySongTitle}>{dailySong.daily_song_title}</Text>
            <Text style={styles.dailySongArtist}>{dailySong.daily_song_artist}</Text>
          </View>
        )}
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>

        <TouchableOpacity style={styles.featureCard} activeOpacity={0.75} onPress={() => router.push('/generate-lyrics-format')}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={20} color="#E8D5FF" />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, ThemeTextStyles.h3]}>Generate Lyrics</Text>
            <Text style={[styles.description, ThemeTextStyles.description]}>Automates lyrics format (Kanji, Romaji, English)</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} activeOpacity={0.75} onPress={() => router.push('/news-feed')}>
          <View style={[styles.iconContainer, styles.iconContainer]}>
            <Ionicons name="newspaper" size={20} color="#A8F0D8" />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, ThemeTextStyles.h3]}>News Feed</Text>
            <Text style={[styles.description, ThemeTextStyles.description]}>Check latest updates in J-music industry</Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Profile + Logout */}
      <View style={styles.profileSection}>
        {/* Logout button */}
          <TouchableOpacity style={[styles.logoutBtn, ThemeButtonStyles.signOutBtn]}>
          {user?.user_metadata?.avatar_url ? (
            <Image
              source={{ uri: user.user_metadata.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={18} color="#FFFFFF" />
            </View>
          )}
          <Ionicons name="log-out-outline" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PADDING_TOP,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  vinylSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylGlowBackdrop: {
    padding: 10,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  vinyl: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgb(18, 18, 18)',
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinylRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',  // slightly more visible
  },
  vinylInnerRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vinylCenter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',  // clips image to circle
  },
  vinylCenterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  centerIconGlow: {
    opacity: 0.95,
    textShadowColor: 'rgba(19, 18, 18, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  dailySongInfo: {
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  dailySongTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dailySongArtist: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  featuresSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.66)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 14,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    letterSpacing: -0.2,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    lineHeight: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarFallback: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});