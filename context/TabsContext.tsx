// context/TabContext.tsx
import { LinearGradient } from "expo-linear-gradient";
import { ThemeKey, useTheme } from "./ThemeContext";

const tabThemeStyles: Record<ThemeKey, any> = {
  nostalgia: {
    tabBarActiveTintColor: "#1B3022", 
    tabBarInactiveTintColor: "rgba(27, 48, 34, 0.45)", 
    
    tabBarStyle: {
      borderTopColor: "rgba(126, 200, 160, 0.3)", 
      borderTopWidth: 1,
      elevation: 0,
      backgroundColor: 'transparent',
    },
    tabBarLabelStyle: {
      fontFamily: "Marcellus_400Regular",
      fontSize: 11,
      letterSpacing: 1.5,
      fontWeight: '600',
      textShadowColor: 'rgba(255, 255, 255, 0.25)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    tabBarBackground: () => (
      <LinearGradient
        // Your exact nature-tinted colors
        colors={["#96C47B", "#548687"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      />
    ),
  },
  refreshing: {
    tabBarActiveTintColor: "#006064", 
    tabBarInactiveTintColor: "rgba(0, 77, 64, 0.5)", 
    
    tabBarStyle: {
      borderTopColor: "rgba(0, 151, 167, 0.3)", // Slightly stronger cyan border
      borderTopWidth: 1,
      elevation: 0,
      backgroundColor: 'transparent', 
    },
    tabBarLabelStyle: {
      fontFamily: "PlaywriteGBS_400Regular",
      fontSize: 10,
      letterSpacing: 1,
      textShadowColor: 'rgba(255, 255, 255, 0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    tabBarBackground: () => (
      <LinearGradient
        colors={["#E0F7FA", "#80DEEA", "#00BCD4"]} // ← white → light cyan → deep cyan
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} 
        style={{ flex: 1 }}
      />
    ),
  },
  love: {
    tabBarActiveTintColor: "#AD1457", 
    tabBarInactiveTintColor: "rgba(173, 20, 87, 0.45)", 
    tabBarStyle: {
      borderTopColor: "rgba(232, 160, 180, 0.3)",
      borderTopWidth: 1,
      backgroundColor: 'transparent',
    },
    tabBarLabelStyle: {
      fontFamily: "DancingScript_600SemiBold",
      fontSize: 12, 
      letterSpacing: 0,
      fontWeight: '600',
      textShadowColor: 'rgba(255, 255, 255, 0.7)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    tabBarBackground: () => (
      <LinearGradient
        colors={["#FFF0F5", "#FFD1DC", "#F48FB1"]} 
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      />
    ),
  },
  cheerful: {
    tabBarActiveTintColor: "#BF360C", 
    tabBarInactiveTintColor: "rgba(120, 70, 0, 0.5)", // Muted Amber-Bronze
    
    tabBarStyle: {
      borderTopColor: "rgba(255, 255, 255, 0.5)", // White "Sunbeam" top border
      borderTopWidth: 2,
      elevation: 10, 
      paddingBottom: 12,
      backgroundColor: 'transparent',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: 'absolute',
    },
    
    tabBarLabelStyle: {
      fontFamily: "Fredoka_600SemiBold",
      fontSize: 12,
      letterSpacing: 0.5,
      textTransform: 'lowercase', 
      textShadowColor: 'rgba(255, 255, 255, 0.9)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },

    tabBarBackground: () => (
      <LinearGradient
        colors={["#FFFDE7", "#FFD54F", "#F57C00"]} 
        start={{ x: 0, y: 1 }} 
        end={{ x: 1, y: 0 }} 
        style={{ 
          flex: 1, 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20,
          overflow: 'hidden' 
        }}
      />
    ),
  },
  emo: {
  tabBarActiveTintColor: "#E0E0E0", 
  tabBarInactiveTintColor: "rgba(255, 255, 255, 0.2)", 
  
  tabBarStyle: {
    backgroundColor: 'transparent',
    borderTopColor: "rgba(255, 255, 255, 0.05)", 
    borderTopWidth: 1,
  },
  tabBarLabelStyle: {
    fontFamily: "AlmendraDisplay_400Regular",
    fontSize: 12,
    letterSpacing: 2,
  },
  tabBarBackground: () => (
    <LinearGradient
      colors={["#000000", "#1A1A1B", "#2D2D2E"]} 
      start={{ x: 0.5, y: 1 }} 
      end={{ x: 0.5, y: 0 }} 
      style={{ flex: 1 }}
    />
  ),
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
