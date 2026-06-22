// components/MusicPlayer.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';

type Props = {
  uri: string | null | undefined;
};

const SKIP_MS = 4000;
const PLAY_BTN = 38;

export default function MusicPlayer({ uri }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const barWidth = useRef(0);
  const isScrubbing = useRef(false);
  const seekingRef = useRef(false);
  const scrubRatio = useRef(0);
  const [visualProgress, setVisualProgress] = useState(0);

  // ─── Load / reload audio whenever uri changes ─────────────────────────────

  useEffect(() => {
    let sound: Audio.Sound;

    const loadAudio = async () => {
      if (!uri) return;

      // Unload any previous sound first
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        setVisualProgress(0);
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        (status) => {
          if (!status.isLoaded) return;
          if (!isScrubbing.current && !seekingRef.current) {
            setPosition(status.positionMillis);
            setVisualProgress(
              status.durationMillis ? status.positionMillis / status.durationMillis : 0
            );
          }
          setDuration(status.durationMillis ?? 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
            setVisualProgress(0);
          }
        }
      );

      soundRef.current = newSound;
      sound = newSound;
    };

    loadAudio();

    return () => {
      sound?.unloadAsync();
    };
  }, [uri]);

  // ─── Controls ─────────────────────────────────────────────────────────────

  const seekTo = async (ms: number) => {
    if (!soundRef.current) return;
    seekingRef.current = true;
    await soundRef.current.setPositionAsync(ms);
    setPosition(ms);
    setVisualProgress(duration > 0 ? ms / duration : 0);
    setTimeout(() => { seekingRef.current = false; }, 300);
  };

  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSkipBack = () => seekTo(Math.max(0, position - SKIP_MS));
  const handleSkipForward = () => seekTo(Math.min(duration, position + SKIP_MS));

  // ─── Scrub bar pan responder ──────────────────────────────────────────────

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
        if (!soundRef.current) return;
        seekingRef.current = true;
        const status = await soundRef.current.getStatusAsync();
        if (!status.isLoaded) { seekingRef.current = false; return; }
        const seekMs = scrubRatio.current * (status.durationMillis ?? 0);
        await soundRef.current.setPositionAsync(seekMs);
        setPosition(seekMs);
        setVisualProgress(scrubRatio.current);
        setTimeout(() => { seekingRef.current = false; }, 300);
      },
    })
  ).current;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!uri) return null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* Progress bar */}
      <View
        style={styles.progressBar}
        onLayout={(e) => { barWidth.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} />
        <View style={[styles.progressFill, { width: `${visualProgress * 100}%` }]} />
        <View style={[styles.progressThumb, { left: `${visualProgress * 100}%` }]} />
      </View>

      {/* Bottom row: time — controls — time */}
      <View style={styles.bottomRow}>

        <Text style={styles.timeText}>
          {formatTime(isScrubbing.current ? scrubRatio.current * duration : position)}
        </Text>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkipBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="play-back" size={15} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#000"
              style={!isPlaying ? { marginLeft: 2 } : undefined}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkipForward}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="play-forward" size={15} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>

        <Text style={styles.timeText}>{formatTime(duration)}</Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(15, 15, 15, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
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
    color: 'rgba(255,255,255,0.4)',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  playBtn: {
    width: PLAY_BTN,
    height: PLAY_BTN,
    borderRadius: PLAY_BTN / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});