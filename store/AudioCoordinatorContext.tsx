// store/AudioCoordinatorContext.tsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import React from 'react';
import { AppState } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

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
  const playerRef = useRef<AudioPlayer | null>(null);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);
  const [isDailySongPlaying, setIsDailySongPlaying] = useState(false);

  const stopDailySong = async () => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.remove(); 
      playerRef.current = null;
    }
    setIsDailySongPlaying(false);
  };

  const playDailySong = async (url: string) => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    if (playerRef.current) {
      playerRef.current.remove();
      playerRef.current = null;
    }

    await setAudioModeAsync({ playsInSilentMode: true });

    const player = createAudioPlayer(url);
    playerRef.current = player;
    player.play();
    setIsDailySongPlaying(true);

    subscriptionRef.current = player.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded && status.didJustFinish) {
        subscriptionRef.current?.remove();
        subscriptionRef.current = null;
        playerRef.current?.remove();
        playerRef.current = null;
        setIsDailySongPlaying(false);
      }
    });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (playerRef.current) {
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