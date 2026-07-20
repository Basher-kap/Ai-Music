// components/MusicPlayer.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio';
import { useMusicPlayerTheme } from '@/context/MusicPlayerContext';
import { useAudioCoordinator } from '@/store';

type Props = {
  uri: string | null | undefined;
};

const SKIP_SECONDS = 4; // was SKIP_MS = 4000 — expo-audio reports time in seconds, not ms
const PLAY_BTN = 38;

export default function MusicPlayer({ uri }: Props) {
  const playerRef = useRef<AudioPlayer | null>(null);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds

  const barWidth = useRef(0);
  const isScrubbing = useRef(false);
  const seekingRef = useRef(false);
  const scrubRatio = useRef(0);
  const [visualProgress, setVisualProgress] = useState(0);

  const { ThemeMusicPlayerStyles } = useMusicPlayerTheme();
  const { stopDailySong } = useAudioCoordinator();

  useEffect(() => {
    if (!uri) return;
    let cancelled = false;

    // Tear down whatever was previously loaded
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    playerRef.current?.remove();
    playerRef.current = null;
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    setVisualProgress(0);

    (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'doNotMix',
      });
      if (cancelled) return;

      const player = createAudioPlayer(uri, { updateInterval: 250 });
      playerRef.current = player;

      subscriptionRef.current = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
        if (!status.isLoaded) return;
        if (!isScrubbing.current && !seekingRef.current) {
          setPosition(status.currentTime);
          setVisualProgress(status.duration ? status.currentTime / status.duration : 0);
        }
        setDuration(status.duration ?? 0);
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPosition(0);
          setVisualProgress(0);
        }
      });
    })();

    return () => {
      cancelled = true;
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, [uri]);

  const seekTo = async (seconds: number) => {
    if (!playerRef.current) return;
    seekingRef.current = true;
    await playerRef.current.seekTo(seconds);
    setPosition(seconds);
    setVisualProgress(duration > 0 ? seconds / duration : 0);
    setTimeout(() => { seekingRef.current = false; }, 300);
  };

  const handlePlayPause = async () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      // Because daily song and music player would overlap if both play at once
      await stopDailySong();
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSkipBack = () => seekTo(Math.max(0, position - SKIP_SECONDS));
  const handleSkipForward = () => seekTo(Math.min(duration, position + SKIP_SECONDS));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        isScrubbing.current = true;
        const ratio = Math.min(Math.max(e.nativeEvent.locationX / barWidth.current, 0), 1);
        scrubRatio.current = ratio;
        setVisualProgress(ratio);
      },
      onPanResponderMove: (e) => {
        const ratio = Math.min(Math.max(e.nativeEvent.locationX / barWidth.current, 0), 1);
        scrubRatio.current = ratio;
        setVisualProgress(ratio);
      },
      onPanResponderRelease: async () => {
        isScrubbing.current = false;
        if (!playerRef.current) return;
        seekingRef.current = true;
        const seekSeconds = scrubRatio.current * duration;
        await playerRef.current.seekTo(seekSeconds);
        setPosition(seekSeconds);
        setVisualProgress(scrubRatio.current);
        setTimeout(() => { seekingRef.current = false; }, 300);
      },
    })
  ).current;

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!uri) return null;

  return (
    <View style={[styles.container, ThemeMusicPlayerStyles.container]}>
      <View
        style={styles.progressBar}
        onLayout={(e) => { barWidth.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.track, ThemeMusicPlayerStyles.track]} />
        <View style={[styles.progressFill, ThemeMusicPlayerStyles.progressFill, { width: `${visualProgress * 100}%` }]} />
        <View style={[styles.progressThumb, ThemeMusicPlayerStyles.progressThumb, { left: `${visualProgress * 100}%` }]} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.timeText, ThemeMusicPlayerStyles.timeText]}>
          {formatTime(isScrubbing.current ? scrubRatio.current * duration : position)}
        </Text>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.skipBtn, ThemeMusicPlayerStyles.skipBtn]}
            onPress={handleSkipBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="play-back" size={15} color={ThemeMusicPlayerStyles.skipIconColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, ThemeMusicPlayerStyles.playBtn]}
            onPress={handlePlayPause}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color={ThemeMusicPlayerStyles.playIconColor}
              style={!isPlaying ? { marginLeft: 2 } : undefined}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.skipBtn, ThemeMusicPlayerStyles.skipBtn]}
            onPress={handleSkipForward}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="play-forward" size={15} color={ThemeMusicPlayerStyles.skipIconColor} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.timeText, ThemeMusicPlayerStyles.timeText]}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 2,
  },
  progressBar: {
    height: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: 3,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    marginLeft: -6,
    top: '50%',
    marginTop: -6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 10,
    width: 32,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skipBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: PLAY_BTN,
    height: PLAY_BTN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});