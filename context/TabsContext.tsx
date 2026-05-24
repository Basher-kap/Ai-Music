// context/TabContext.tsx
import React from "react";
import { View, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeKey, useTheme } from "./ThemeContext";

interface TabThemeStyle {
  tabBarActiveTintColor: string;
  tabBarInactiveTintColor: string;
  tabBarStyle: ViewStyle;
  tabBarLabelStyle: TextStyle;
  tabBarBackground: () => React.ReactElement;
}

/**
 * 1. NOSTALGIA BACKGROUND
 */
const NostalgiaTabBg = () => (
  <View style={styles.fullStretch}>
    <LinearGradient colors={["#A8D08D", "#76A68F", "#548687"]} style={StyleSheet.absoluteFill} />
    <View style={[StyleSheet.absoluteFill, { opacity: 0.08 }]}>
      {[...Array(6)].map((_, i) => (
        <View key={i} style={{ position: 'absolute', top: i * 15, width: '100%', height: 1, backgroundColor: '#465f3c' }} />
      ))}
    </View>
    <LinearGradient colors={["rgba(27, 48, 34, 0.15)", "transparent", "rgba(27, 48, 34, 0.15)"]} style={StyleSheet.absoluteFill} />
  </View>
);

/**
 * 2. REFRESHING BACKGROUND
 */
const RefreshingTabBg = () => (
  <View style={styles.fullStretch}>
    <LinearGradient colors={["#E0F7FA", "#B2EBF2", "#80DEEA"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
    <LinearGradient colors={["rgba(255, 255, 255, 0.94)", "transparent"]} style={StyleSheet.absoluteFill} />
    {/* Water Droplets */}
    <View style={{ position: 'absolute', top: 5, left: '15%', width: 10, height: 10, borderRadius: 5, backgroundColor: '#6ac3ec', opacity: 0.3 }} />
    <View style={{ position: 'absolute', bottom: 15, left: '40%', width: 15, height: 15, borderRadius: 8, backgroundColor: 'rgba(159, 234, 249, 0.6)', opacity: 0.4 }} />
    {/* Frosted Edge */}
    <View style={{ height: 1.5, backgroundColor: "rgba(182, 239, 255, 0.8)", width: '100%', position: 'absolute', top: 0 }} />
  </View>
);

/**
 * 3. LOVE BACKGROUND
 */
const LoveTabBg = () => (
  <View style={[styles.fullStretch, { backgroundColor: '#FFD1DC' }]}>
    <LinearGradient colors={["#FFF0F5", "#FFD1DC", "#F48FB1"]} style={StyleSheet.absoluteFill} />
    {/* Soft Bokeh Circles */}
    <View style={{ position: 'absolute', top: 5, left: '5%', width: 22, height: 22, borderRadius: 11, backgroundColor: '#f98f8f', opacity: 0.3 }} />
    <View style={{ position: 'absolute', bottom: 10, right: '15%', width: 30, height: 30, borderRadius: 15, backgroundColor: '#ab2a55', opacity: 0.1 }} />
    <View style={{ height: 3, backgroundColor: "rgba(255, 255, 255, 0.6)", width: '100%', position: 'absolute', top: 0 }} />
  </View>
);

/**
 * 4. EMO BACKGROUND
 */
const EmoTabBg = () => (
  <View style={[styles.fullStretch, { backgroundColor: '#050505' }]}>
    <LinearGradient colors={["transparent", "rgba(97, 85, 129, 0.2)"]} style={StyleSheet.absoluteFill} />
    {/* Rain Needles */}
    {[...Array(12)].map((_, i) => (
      <View key={i} style={{ position: 'absolute', top: (i * 7) % 40, left: i * 35, width: 1, height: 5, backgroundColor: 'rgba(234, 230, 255, 0.2)' }} />
    ))}
    <LinearGradient colors={["rgba(247, 246, 253, 0.2)", "transparent"]} style={{ height: 1.5, width: '100%', position: 'absolute', top: 0 }} />
  </View>
);

/**
 * 5. ASPIRE BACKGROUND
 */
const AspireTabBg = () => (
  <View style={[styles.fullStretch, { borderRadius: 20, overflow: 'hidden' }]}>
    <LinearGradient colors={["rgba(40, 20, 80, 0.85)", "rgba(15, 5, 30, 0.95)"]} style={StyleSheet.absoluteFill} />
    {/* Stars */}
    <View style={{ position: "absolute", top: 15, left: 50, width: 2, height: 2, borderRadius: 1, backgroundColor: "#FFF", opacity: 0.8 }} />
    <View style={{ position: "absolute", bottom: 20, right: 80, width: 2, height: 2, borderRadius: 1, backgroundColor: "#E8E8FF", opacity: 0.6 }} />
    <View style={{ height: 1, backgroundColor: "rgba(255, 255, 255, 0.3)", width: "80%", alignSelf: "center", position: "absolute", top: 0 }} />
  </View>
);

/**
 * 6. DETERMINATION BACKGROUND
 */
const DeterminationTabBg = () => (
  <View style={[styles.fullStretch, { backgroundColor: '#0F0F0F' }]}>
    <LinearGradient colors={["rgba(255, 49, 49, 0.05)", "transparent"]} style={StyleSheet.absoluteFill} />
    {[...Array(15)].map((_, i) => (
      <View key={i} style={{ position: 'absolute', left: i * 30, width: 2, height: '100%', backgroundColor: 'rgba(255,255,255,0.02)', transform: [{ skewX: '-20deg' }] }} />
    ))}
    <LinearGradient colors={["#8c1818", "#ff5331", "#8c1818"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 3, width: '30%', position: 'absolute', top: 0, left: '35%', borderRadius: 2, zIndex: 100 }} />
    <LinearGradient colors={["#0A0A12", "#8c1818", "#f6890d"]} style={{ position: 'absolute', top: 18, left: 0, right: 0, bottom: 0 }} />
  </View>
);

/**
 * 7. WRATH BACKGROUND
 */
const WrathTabBg = () => (
  <View style={[styles.fullStretch, { backgroundColor: '#000' }]}>
    <LinearGradient colors={["#ff0000a0", "#660000", "#000000"]} style={{ height: 20, width: '100%' }} />
    {/* Hazard Stripes */}
    <View style={{ ...StyleSheet.absoluteFillObject, flexDirection: 'row', opacity: 0.1 }}>
      {[...Array(10)].map((_, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: '#FF0000', marginHorizontal: 2, transform: [{ skewX: '-25deg' }] }} />
      ))}
    </View>
    <View style={{ height: 1.5, backgroundColor: "#9f0c0c", width: '100%', position: 'absolute', top: 0 }} />
  </View>
);

/**
 * MAIN THEME CONFIGURATION
 */
const tabThemeStyles: Record<ThemeKey, TabThemeStyle> = {
  nostalgia: {
    tabBarActiveTintColor: "#1B3022",
    tabBarInactiveTintColor: "rgba(27, 48, 34, 0.5)",
    tabBarStyle: { height: 60, backgroundColor: '#7aaf5bc1', borderTopWidth: 2, borderTopColor: "rgba(255, 255, 255, 0.3)" },
    tabBarLabelStyle: { fontFamily: "Marcellus_400Regular", fontSize: 9, letterSpacing: 1.5, textTransform: 'lowercase' },
    tabBarBackground: () => <NostalgiaTabBg />
  },
  refreshing: {
    tabBarActiveTintColor: "#006064",
    tabBarInactiveTintColor: "rgba(0, 96, 100, 0.4)",
    tabBarStyle: { height: 60, backgroundColor: 'transparent', borderTopWidth: 0 },
    tabBarLabelStyle: { fontFamily: "PlaywriteGBS_400Regular", fontSize: 9, textTransform: 'lowercase' },
    tabBarBackground: () => <RefreshingTabBg />
  },
  love: {
    tabBarActiveTintColor: "#880E4F",
    tabBarInactiveTintColor: "rgba(173, 20, 87, 0.4)",
    tabBarStyle: { height: 60, backgroundColor: '#FFF0F5', borderTopWidth: 0 },
    tabBarLabelStyle: { fontFamily: "DancingScript_600SemiBold", fontSize: 11 },
    tabBarBackground: () => <LoveTabBg />
  },
  cheerful: {
    tabBarActiveTintColor: "#BF360C",
    tabBarInactiveTintColor: "rgba(120, 70, 0, 0.5)",
    tabBarStyle: { height: 60, backgroundColor: 'transparent', borderTopWidth: 2, borderTopColor: "rgba(255, 255, 255, 0.5)", borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    tabBarLabelStyle: { fontFamily: "Fredoka_600SemiBold", fontSize: 8 },
    tabBarBackground: () => (
      <LinearGradient colors={["#FFFDE7", "#FFD54F", "#F57C00"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }} />
    )
  },
  emo: {
    tabBarActiveTintColor: "#EAE6FF",
    tabBarInactiveTintColor: "rgba(195, 187, 217, 0.4)",
    tabBarStyle: { height: 60, backgroundColor: "transparent", borderTopWidth: 0 },
    tabBarLabelStyle: { fontFamily: "AlmendraDisplay_400Regular", letterSpacing: 2 },
    tabBarBackground: () => <EmoTabBg />
  },
  aspire: {
    tabBarActiveTintColor: "#FFFFFF",
    tabBarInactiveTintColor: "rgba(200, 200, 255, 0.4)",
    tabBarStyle: { height: 60, backgroundColor: "transparent", borderTopWidth: 0 },
    tabBarLabelStyle: { fontFamily: "Syne_600SemiBold", fontSize: 8, textTransform: "uppercase" },
    tabBarBackground: () => <AspireTabBg />
  },
  determination: {
    tabBarActiveTintColor: "#c35e0c", 
    tabBarInactiveTintColor: "rgba(255, 255, 255, 0.3)",
    tabBarStyle: { height: 60, backgroundColor: "#0A0A0A", borderTopWidth: 0 },
    tabBarLabelStyle: { fontFamily: "RussoOne_400Regular", fontSize: 7, textTransform: 'uppercase' },
    tabBarBackground: () => <DeterminationTabBg />
  },
  wrath: {
    tabBarActiveTintColor: "#FFFFFF",
    tabBarInactiveTintColor: "rgba(216, 27, 17, 0.73)",
    tabBarStyle: { height: 60, backgroundColor: "#000000", borderTopWidth: 0 },
    tabBarLabelStyle: { fontFamily: "MetalMania_400Regular", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' },
    tabBarBackground: () => <WrathTabBg />
  }
};

const styles = StyleSheet.create({
  fullStretch: { ...StyleSheet.absoluteFillObject }
});

export function useTabTheme() {
  const { activeTheme } = useTheme();
  return { tabStyles: tabThemeStyles[activeTheme] || tabThemeStyles.nostalgia };
}