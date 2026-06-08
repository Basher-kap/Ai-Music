// components/SongListSkeleton.tsx
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
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
    <Animated.View style={[styles.card, { opacity }]}>
      {/* Title placeholder */}
      <View style={styles.titleBar} />
      {/* Artist placeholder */}
      <View style={styles.artistBar} />
    </Animated.View>
  );
}

export default function SongListSkeleton() {
  // Because showing 5 skeleton cards fills the screen naturally
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  titleBar: {
    height: 16,
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
  },
  artistBar: {
    height: 10,
    width: '35%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
  },
});