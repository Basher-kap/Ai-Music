// app/(tabs)/theme.tsx
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTextTheme } from '../../context/TextContext';

const themes = [
  {
    key: 'nostalgia',
    name: 'Nostalgia',
    emoji: '🌿',
    description: 'Atmospheric nature-tinted vibe filled with melancholy, healing, and dreamlike youth memories lingering away yet remains.',
    tagline: 'linger a little longer',
  },
  {
    key: 'refreshing',
    name: 'Refreshing',
    emoji: '🌊',
    description: "Light, airy, and uplifting mood that eases one's mind then taking a deep breath, evoking feelings of renewal, hope, and rejuvenation.",
    tagline: 'a breath of new life',
  },
  {
    key: 'love',
    name: 'Love',
    emoji: '🌸',
    description: "Story of unrequited feelings, first shiver of romance, and supporting of one's dear life.",
    tagline: 'my feelings for you will reach',
  },
  {
    key: 'cheerful',
    name: 'Cheerful',
    emoji: '☀️',
    description: 'Gives warm burst of joy and hope, a will to take another challenge, and embrace sunshine moments of happiness and fun.',
    tagline: '',
  },
  {
    key: 'emo',
    name: 'Emo',
    emoji: '🖤',
    description: 'Descending, sinking deep to darkness of despair born from tragedies and unhealthy inner self shadows.',
    tagline: '',
  },
  {
    key: 'aspire',
    name: 'Aspire',
    emoji: '🌌',
    description: 'Gaze into the stars, expanding galaxy, starry skies, and find the never-ending future of our life and this world.',
    tagline: '',
  },
  {
    key: 'determination',
    name: 'Determination',
    emoji: '🔥',
    description: "Unwavering strong belief, hardened resolve — one's commitment to war.",
    tagline: '',
  },
  {
    key: 'wrath',
    name: 'Wrath',
    emoji: '🩸',
    description: 'Aggressive motivation forged from anger turned to power, fueling rebellion and adapts to evil.',
    tagline: '',
  },
];

const themeAccents: Record<string, string> = {
  nostalgia:     '#7EC8A0',
  refreshing:    '#7EC8E3',
  love:          '#E8A0B4',
  cheerful:      '#FFD166',
  emo:           '#525252',
  aspire:        '#6334ae',
  determination: '#FF6B35',
  wrath:         '#C0392B',
};

export default function Theme() {
  const { activeTheme, setActiveTheme } = useTheme();
  const { ThemeTextStyles } = useTextTheme();

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={[ThemeTextStyles.appTitle]}>Ai Music</Text>
      </View>

      {/* Scrollable cards below */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {themes.map((theme) => {
          const isActive = activeTheme === theme.key;
          const accent = themeAccents[theme.key];

          return (
            <TouchableOpacity
              key={theme.key}
              onPress={() => setActiveTheme(theme.key as any)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.card,
                isActive && { borderColor: accent, backgroundColor: 'rgba(0,0,0,0.6)' },
                isActive && { borderLeftWidth: 5, borderLeftColor: accent }
              ]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.emoji}>{theme.emoji}</Text>
                  <View style={styles.nameRow}>
                    <Text style={[
                      styles.themeName,
                      isActive && { color: accent },
                    ]}>
                      {theme.name}
                    </Text>
                  </View>
                </View>

                <View style={isActive ? styles.descriptionWrapper : undefined}>
                  <Text style={[
                    styles.description,
                    isActive && ThemeTextStyles.description,
                  ]}>
                    {theme.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(15, 15, 15, 0.45)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  descriptionWrapper: {
    marginTop: 4,
    paddingLeft: 4, 
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  emoji: { fontSize: 26 },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});