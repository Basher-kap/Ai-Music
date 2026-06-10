// components/MusicPlayer.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

type Props = {
  uri: string | null | undefined;
}

export default function MusicPlayer({uri}: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let sound: Audio.Sound;

    const loadAudio = async () => {
      if (!uri) return;

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true});

      const { sound: newSound } = await Audio.Sound.createAsync(
        {uri}, {shouldPlay: false}, (status) => {
          if (!status.isLoaded) return;
          setPosition(status.positionMillis);
          setDuration(status.durationMillis ?? 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
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
  },[uri]);

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

  const progress = duration > 0 ? position / duration : 0;

  if (!uri) return null; // hide player if no audio uploaded yet
  
  return (
    <View style={styles.container}>

      {/* Play/Pause Button */}
      <TouchableOpacity onPress={handlePlayPause}>
        <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle' } size={36} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Progress Bar + Time */}
      <View style={styles.progressSection}>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
          <View style={styles.progressThumb} />
        </View>

        {/* Time */}
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
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
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressFill: {
    width: '30%',       // hardcoded for now
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressThumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginLeft: -4,
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