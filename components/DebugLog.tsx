// components/DebugLog.tsx
// Drop this anywhere in your app temporarily to see logs on device.
// Remove when done testing.
//
// Usage in songs.tsx:
//   import DebugLog from '@/components/DebugLog';
//   const { debugLog } = useSongs();
//   ...
//   <DebugLog logs={debugLog} />

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DebugLog({ logs }: { logs: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.toggle} onPress={() => setOpen(o => !o)}>
        <Text style={styles.toggleText}>{open ? '▼ Hide Log' : '▲ Debug Log'} ({logs.length})</Text>
      </TouchableOpacity>

      {open && (
        <ScrollView style={styles.box} contentContainerStyle={{ padding: 8 }}>
          {[...logs].reverse().map((line, i) => (
            <Text key={i} style={[
              styles.line,
              line.includes('OFFLINE') || line.includes('FAILED') || line.includes('failed') || line.includes('crashed')
                ? styles.error
                : line.includes('ONLINE') || line.includes('synced') || line.includes('done')
                  ? styles.success
                  : styles.info,
            ]}>
              {line}
            </Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    maxHeight: 300,
  },
  toggle: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  toggleText: {
    color: '#aaffaa',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  box: {
    backgroundColor: 'rgba(0,0,0,0.92)',
    maxHeight: 260,
  },
  line: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  error:   { color: '#ff6b6b' },
  success: { color: '#aaffaa' },
  info:    { color: '#cccccc' },
});