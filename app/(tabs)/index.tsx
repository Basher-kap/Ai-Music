// app/(tabs)/index.tsx
import { Text, View, StyleSheet, TouchableOpacity, Easing, Animated } from 'react-native';
import { useTextTheme } from '@/context';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '@/constant';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  const { ThemeTextStyles } = useTextTheme();

  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={[ThemeTextStyles.appTitle]}>Ai Music</Text>
      </View>

      {/* Vinyl */}
      <View style={styles.vinylSection}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
          {/* Glassmorphic Vinyl Shadow Backdrop Ring */}
          <View style={styles.vinylGlowBackdrop}>
            <Animated.View style={[styles.vinyl, { transform: [{ rotate }] }]}>
              {/* Outer ring */}
              <View style={styles.vinylRing} />
              {/* Secondary audio micro-groove ring for high-fidelity design depth */}
              <View style={styles.vinylInnerRing} />
              {/* Center hole */}
              <View style={styles.vinylCenter}>
                <Ionicons name="musical-note" size={24} color="#FFFFFF" style={styles.centerIconGlow} />
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>

        <TouchableOpacity style={styles.featureCard} activeOpacity={0.75} onPress={() => {}}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={20} color="#E8D5FF" />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Generate Lyrics</Text>
            <Text style={styles.featureSubtitle}>Automates lyrics format (Kanji, Romaji, English)</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} activeOpacity={0.75} onPress={() => {}}>
          <View style={[styles.iconContainer, styles.iconContainer]}>
            <Ionicons name="newspaper" size={20} color="#A8F0D8" />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>News Feed</Text>
            <Text style={styles.featureSubtitle}>Check latest updates in J-music industry</Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={() => router.push('/login')}>
          <Ionicons name="log-out-outline" size={16} color="rgba(255, 255, 255, 0.7)" />
          <Text style={styles.logoutBtnText}>Logout</Text>
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
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  vinylInnerRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  vinylCenter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  centerIconGlow: {
    opacity: 0.95,
    textShadowColor: 'rgba(19, 18, 18, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  featureSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    lineHeight: 16,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    alignItems: 'flex-end',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 74, 74, 0.37)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 7,
  },
  logoutBtnText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});