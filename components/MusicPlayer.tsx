// components/MusicPlayer.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MusicPlayer() {
  return (
    <View style={styles.container}>

      {/* Play/Pause Button */}
      <TouchableOpacity onPress={() => {}}>
        <Ionicons name="play-circle" size={36} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Progress Bar + Time */}
      <View style={styles.progressSection}>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
          <View style={styles.progressThumb} />
        </View>

        {/* Time */}
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>0:32</Text>
          <Text style={styles.timeText}>3:45</Text>
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