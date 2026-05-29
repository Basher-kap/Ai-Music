// app/(tabs)/theme.tsx
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, useTextTheme } from '@/context';
import { THEMES, THEME_ACCENTS, THEME_KEYS} from '@/constant';

export default function Theme() {
  const { activeTheme, setActiveTheme } = useTheme();
  const { ThemeTextStyles } = useTextTheme();

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={[ThemeTextStyles.appTitle]}>Ai Music</Text>
      </View>

      <View style={styles.subHeader}>
        <Text style={[ThemeTextStyles.tagline]}>
          {THEMES.find(t => t.key === activeTheme)?.tagline }
        </Text>
      </View>

      {/* Scrollable cards below */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.key;
          const accent = THEME_ACCENTS[theme.key];

          return (
            <TouchableOpacity
              key={theme.key}
              onPress={() => setActiveTheme(theme.key as any)} // this is where the theme changes on cards to press
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
    backgroundColor: 'transparent',
  },
  scroll: { flex: 1 },
  header: {
    height: 130,              
    paddingTop: 50,           
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end', 
    overflow: 'hidden',
  },
  subHeader: {
    height: 24,                        
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(15, 15, 15, 0.32)',
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
    color: 'rgba(255, 255, 255, 0.94)',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});