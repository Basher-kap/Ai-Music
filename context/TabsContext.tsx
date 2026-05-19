// context/TabContext.tsx
import { LinearGradient } from "expo-linear-gradient";
import { ThemeKey, useTheme } from "./ThemeContext";

const tabThemeStyles: Record<ThemeKey, any> = {
  nostalgia: {
    tabBarActiveTintColor: "#7EC8A0",
    tabBarInactiveTintColor: "rgba(255,255,255,0.35)",
    tabBarStyle: {
      borderTopColor: "rgba(126, 200, 160, 0.15)",
      borderTopWidth: 1,
    },
    tabBarLabelStyle: {
      fontFamily: "Marcellus_400Regular",
      fontSize: 11,
      letterSpacing: 1,
    },
    tabBarBackground: () => (
      <LinearGradient
        colors={["#96C47B", "#548687"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      />
    ),
  },
  refreshing: {
    tabBarActiveTintColor: "#00CED1", // ← deep cyan for active
    tabBarInactiveTintColor: "rgba(200, 240, 245, 0.45)",
    tabBarStyle: {
      borderTopColor: "rgba(0, 206, 209, 0.15)",
      borderTopWidth: 1,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      letterSpacing: 1,
    },
    tabBarBackground: () => (
      <LinearGradient
        colors={["#E0F7FA", "#80DEEA", "#00BCD4"]} // ← white → light cyan → deep cyan
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // ← top to bottom
        style={{ flex: 1 }}
      />
    ),
  },
  love: {
    tabBarActiveTintColor: "#B03060", // Deep Maroon-Pink for visibility
    tabBarInactiveTintColor: "rgba(176, 48, 96, 0.4)", 
    
    tabBarStyle: {
      borderTopColor: "rgba(232, 160, 180, 0.4)",
      borderTopWidth: 1,
      elevation: 0,
      backgroundColor: 'transparent',
      height: 65,
      paddingBottom: 10,
    },
    tabBarLabelStyle: {
      fontFamily: "PlaywriteITModerna_400Regular",
      fontSize: 10,
      letterSpacing: 0,
      marginTop: 2,
      textShadowColor: 'rgba(255, 255, 255, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    tabBarBackground: () => (
      <LinearGradient
        // Pearl White → Petal Pink → Dusty Rose
        colors={["#FFF9FB", "#F8C8D4", "#E8A0B4"]} 
        start={{ x: 0.5, y: 0 }} 
        end={{ x: 0.5, y: 1 }} 
        style={{ flex: 1 }}
      />
    ),
  },
  cheerful: {
    tabBarActiveTintColor: "#FFD166",
    tabBarStyle: { backgroundColor: "transparent" },
  },
  emo: {
    tabBarActiveTintColor: "#00030d",
    tabBarStyle: { backgroundColor: "transparent" },
  },
  aspire: {
    tabBarActiveTintColor: "#6334ae",
    tabBarStyle: { backgroundColor: "transparent" },
  },
  determination: {
    tabBarActiveTintColor: "#FF6B35",
    tabBarStyle: { backgroundColor: "transparent" },
  },
  wrath: {
    tabBarActiveTintColor: "#C0392B",
    tabBarStyle: { backgroundColor: "transparent" },
  },
};

const defaultTabStyle = {
  tabBarActiveTintColor: "#ffd33d",
  tabBarStyle: { backgroundColor: "transparent" },
};

export function useTabTheme() {
  const { activeTheme } = useTheme();
  const tabStyles = activeTheme ? tabThemeStyles[activeTheme] : defaultTabStyle;
  return { tabStyles };
}
