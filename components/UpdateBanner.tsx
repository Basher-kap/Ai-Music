// components/UpdateBanner.tsx
import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Updates from 'expo-updates';

import { useTheme } from '@/context';
import { THEME_ACCENTS } from '@/constant';

export default function UpdateBanner() {
  const { activeTheme } = useTheme();
  const { isUpdatePending, isUpdateAvailable } = Updates.useUpdates();
  const slideAnim = useRef(new Animated.Value(80)).current;

  // Only relevant for real OTA-capable builds: skipped on web (no expo-updates
  // runtime there) and in __DEV__ (dev client doesn't apply OTA updates,
  // so isUpdatePending would never reflect anything meaningful).
  const shouldTrack = Platform.OS !== 'web' && !__DEV__;
  const visible = shouldTrack && (isUpdatePending || isUpdateAvailable);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 80,
      useNativeDriver: true,
      friction: 9,
      tension: 60,
    }).start();
  }, [visible]);

  if (!shouldTrack) return null;

  const accent = THEME_ACCENTS[activeTheme] ?? '#7EC8A0';

  const label = isUpdatePending
    ? 'Update ready — restart to apply'
    : 'Downloading update…';

  async function handleRestart() {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      console.log('[UpdateBanner] reloadAsync failed:', e);
    }
  }

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={[styles.banner, { borderColor: accent }]}>
        <View style={styles.textRow}>
          <Ionicons
            name={isUpdatePending ? 'refresh-circle-outline' : 'cloud-download-outline'}
            size={20}
            color={accent}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.label}>{label}</Text>
        </View>

        {isUpdatePending && (
          <TouchableOpacity
            onPress={handleRestart}
            activeOpacity={0.8}
            style={[styles.restartButton, { backgroundColor: accent }]}
          >
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    zIndex: 999,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 20, 20, 0.92)',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  restartButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  restartText: {
    color: '#0a0a0a',
    fontSize: 13,
    fontWeight: '700',
  },
});