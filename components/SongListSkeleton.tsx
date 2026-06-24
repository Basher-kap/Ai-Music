// components/SongListSkeleton.tsx
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { useSongItemTheme } from '@/context/SongItemContext';

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const { ThemeSongItemStyles } = useSongItemTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, ThemeSongItemStyles.skeletonCard, { opacity }]}>
      <View style={[styles.titleBar, ThemeSongItemStyles.skeletonTitleBar]} />
      <View style={[styles.artistBar, ThemeSongItemStyles.skeletonArtistBar]} />
    </Animated.View>
  );
}

export default function SongListSkeleton() {
  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 5,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 15,
    gap: 8,
  },
  titleBar: {
    height: 16,
    width: '60%',
  },
  artistBar: {
    height: 10,
    width: '35%',
  },
});