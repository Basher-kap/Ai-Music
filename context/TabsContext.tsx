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
    tabBarActiveTintColor: "#E8A0B4",
    tabBarStyle: { backgroundColor: "transparent" },
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
