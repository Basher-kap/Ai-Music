import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';

type Props = {
  uri: string | null | undefined;
};

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

  useEffect(() => {
    let sound: Audio.Sound;

    const loadAudio = async () => {
      if (!uri) return;

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        setVisualProgress(0);
      }

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        (status) => {
          if (!status.isLoaded) return;
          // Block stale updates while scrubbing or seeking
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

        // Read duration directly from sound to avoid stale closure
        const status = await soundRef.current.getStatusAsync();
        if (!status.isLoaded) {
          seekingRef.current = false;
          return;
        }

        const seekMs = scrubRatio.current * (status.durationMillis ?? 0);
        await soundRef.current.setPositionAsync(seekMs);
        setPosition(seekMs);
        setVisualProgress(scrubRatio.current);

        // Give the audio engine time to settle before re-enabling status updates
        setTimeout(() => {
          seekingRef.current = false;
        }, 300);
      },
    })
  ).current;

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

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!uri) return null;

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handlePlayPause}>
        <Ionicons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={36}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <View style={styles.progressSection}>

        <View
          style={styles.progressBar}
          onLayout={(e) => { barWidth.current = e.nativeEvent.layout.width; }}
          {...panResponder.panHandlers}
        >
          <View style={styles.track} />
          <View style={[styles.progressFill, { width: `${visualProgress * 100}%` }]} />
          <View style={[styles.progressThumb, { left: `${visualProgress * 100}%` }]} />
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>
            {formatTime(isScrubbing.current ? scrubRatio.current * duration : position)}
          </Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(15, 15, 15, 0.53)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  progressSection: {
    flex: 1,
    gap: 4,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
  },
});