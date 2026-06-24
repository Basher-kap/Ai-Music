// store/AudioCoordinatorContext.tsx
import { createContext, useContext, useRef } from 'react';
import React from 'react';

interface AudioCoordinatorContextType {
  registerStopDailySong: (fn: () => Promise<void>) => void;
  stopDailySong: () => Promise<void>;
}

const AudioCoordinatorContext = createContext<AudioCoordinatorContextType>({
  registerStopDailySong: () => {},
  stopDailySong: async () => {},
});

export function AudioCoordinatorProvider({ children }: { children: React.ReactNode }) {
  // Because useRef persists across renders without causing re-renders
  const stopFnRef = useRef<(() => Promise<void>) | null>(null);

  const registerStopDailySong = (fn: () => Promise<void>) => {
    stopFnRef.current = fn;
  };

  const stopDailySong = async () => {
    if (stopFnRef.current) {
      await stopFnRef.current();
    }
  };

  return (
    <AudioCoordinatorContext.Provider value={{ registerStopDailySong, stopDailySong }}>
      {children}
    </AudioCoordinatorContext.Provider>
  );
}

export function useAudioCoordinator() {
  return useContext(AudioCoordinatorContext);
}