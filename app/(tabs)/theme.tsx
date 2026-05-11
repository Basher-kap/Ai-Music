// app/(tabs)/theme.tsx
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useBgImgTheme } from '../../context/BgImgContext';

const themes = [
  {
    key: 'nostalgia',
    name: 'Nostalgia',
    emoji: '🌿',
    description: 'Atmospheric nature-tinted vibe filled with melancholy, healing, and dreamlike youth memories lingering away yet remains.',
  },
  {
    key: 'refreshing',
    name: 'Refreshing',
    emoji: '🌊',
    description: 'Light, airy, and uplifting mood that eases one\'s mind then taking a deep breath, evoking feelings of renewal, hope, and rejuvenation.',
  },
  {
    key: 'love',
    name: 'Love',
    emoji: '🌸',
    description: 'Story of unrequited feelings, first shiver of romance, and supporting of one\'s dear life.',
  },
  {
    key: 'cheerful',
    name: 'Cheerful',
    emoji: '☀️',
    description: 'Gives warm burst of joy and hope, will to take another challenge, embrace moments, and slice of life.',
  },
  {
    key: 'emo',
    name: 'Emo',
    emoji: '🖤',
    description: 'Descending, sinking deep to darkness of despair born from tragedies and unhealthy inner self shadows.',
  },
  {
    key: 'determination',
    name: 'Determination',
    emoji: '🔥',
    description: 'Unwavering strong belief, hardened resolve — one\'s commitment to war.',
  },
  {
    key: 'wrath',
    name: 'Wrath',
    emoji: '🩸',
    description: 'Aggressive motivation forged from anger turned to power, fueling rebellion and adapts to evil.',
  },
];

export default function Theme() {
  const { activeTheme, setActiveTheme } = useBgImgTheme();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.appTitle}>AI Music</Text>
      <Text style={styles.sectionTitle}>Themes</Text>

      {themes.map((theme) => {
        const isActive = activeTheme === theme.key;
        return (
          <TouchableOpacity
            key={theme.name}
            onPress={() => setActiveTheme(theme.key as any)}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.emoji}>{theme.emoji}</Text>
                <Text style={styles.themeName}>{theme.name}</Text>
                {isActive && <Text style={styles.activeBadge}>Active</Text>}
              </View>
              <Text style={styles.description}>{theme.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  emoji: {
    fontSize: 24,
  },
  themeName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#fff',
  },
  description: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  activeBadge: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 10,
  },
});