// components/EmptyState.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useButtonTheme, useTextTheme } from '@/context';
import { LinearGradient } from 'expo-linear-gradient';
import { ADD_BUTTON_GRADIENTS } from '@/context/ButtonContext';
import { THEME_ACCENTS } from '@/constant';

type Props = {
  onAddSong: () => void;
};

export default function EmptyState({ onAddSong }: Props) {
  const { ThemeButtonStyles, activeTheme } = useButtonTheme();
  const { ThemeTextStyles } = useTextTheme();

  return (
    <View style={styles.container}>

      <View style={styles.iconWrapper}>
        <Ionicons name="musical-notes-outline" size={48} color="rgba(255,255,255,0.2)" />
      </View>

      <Text style={[styles.title, ThemeTextStyles.emptyTitle]}>No songs yet</Text>
      <Text style={[styles.subtitle, ThemeTextStyles.emptySubtitle]}>
        Start building your personal music collection
      </Text>

      <TouchableOpacity style={[styles.addButtonLong]} onPress={onAddSong} activeOpacity={0.8}>
        <LinearGradient
          colors={ADD_BUTTON_GRADIENTS[activeTheme]}
          start={{ x: 0, y: 0.15 }}
          end={{ x: 1, y: 0.85 }}
          style={[styles.addButtonLong, ThemeButtonStyles.addButtonLong]}
        >
          <Ionicons name="add" size={22} color="#fffafa" style={{ marginRight: 4 }} />
          <Text style={styles.addButtonText}>Add your first song</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 70,
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
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    color: 'rgb(255, 255, 255)',
  },
  addButtonLong: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,  
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 10,
  },
  addButtonText: {
    color: '#f9f2f2',
    fontSize: 14,
    fontWeight: '700',
  },
});