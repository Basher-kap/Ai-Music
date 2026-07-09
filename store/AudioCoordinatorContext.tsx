// store/AudioCoordinatorContext.tsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import React from 'react';
import { AppState } from 'react-native';
import { Audio } from 'expo-av';

interface AudioCoordinatorContextType {
  isDailySongPlaying: boolean;
  playDailySong: (url: string) => Promise<void>;
  stopDailySong: () => Promise<void>;
}

const AudioCoordinatorContext = createContext<AudioCoordinatorContextType>({
  isDailySongPlaying: false,
  playDailySong: async () => {},
  stopDailySong: async () => {},
});

export function AudioCoordinatorProvider({ children }: { children: React.ReactNode }) {
  // This provider is mounted once at the app root (above the tab
  // navigator), so — unlike Home itself — it never unmounts when switching
  // tabs. That's why the daily-song Audio.Sound instance and its playing
  // state live here instead of inside Home: on web, inactive tabs are
  // force-unmounted (see app/(tabs)/_layout.tsx), so if Home owned the
  // sound directly, leaving the tab would either orphan it (audio keeps
  // playing but the UI loses track of it) or force it to stop early. Owning
  // it here lets playback genuinely persist across tab switches — matching
  // native — while Home just reflects `isDailySongPlaying`.
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isDailySongPlaying, setIsDailySongPlaying] = useState(false);

  const stopDailySong = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {
        // already stopped/unloaded — safe to ignore
      }
      soundRef.current = null;
    }
    setIsDailySongPlaying(false);
  };

  const playDailySong = async (url: string) => {
    // Replace whatever's currently loaded, if anything
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }

    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    soundRef.current = sound;
    setIsDailySongPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        soundRef.current?.unloadAsync().catch(() => {});
        soundRef.current = null;
        setIsDailySongPlaying(false);
      }
    });
  };

  // Stop when the app itself backgrounds/exits. This lives here (not in
  // Home) because the listener needs to fire no matter which tab is
  // active — if it lived in Home, it wouldn't be mounted to catch the
  // event while you're on the Songs or Theme tab.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (soundRef.current) {
          stopDailySong();
        }
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <AudioCoordinatorContext.Provider value={{ isDailySongPlaying, playDailySong, stopDailySong }}>
      {children}
    </AudioCoordinatorContext.Provider>
  );
}

export function useAudioCoordinator() {
  return useContext(AudioCoordinatorContext);
}