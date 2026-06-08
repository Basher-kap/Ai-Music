// components/EmptyState.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  onAddSong: () => void;
};

export default function EmptyState({ onAddSong }: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.iconWrapper}>
        <Ionicons name="musical-notes-outline" size={48} color="rgba(255,255,255,0.2)" />
      </View>

      <Text style={styles.title}>No songs yet</Text>
      <Text style={styles.subtitle}>Start building your personal music collection</Text>

      <TouchableOpacity style={styles.addButton} onPress={onAddSong}>
        <Ionicons name="add" size={20} color="#000000" />
        <Text style={styles.addButtonText}>Add your first song</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});