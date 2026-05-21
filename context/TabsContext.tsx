// context/TabContext.tsx
import { LinearGradient } from "expo-linear-gradient";
import { ThemeKey, useTheme } from "./ThemeContext";
import { View } from "react-native";

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
    tabBarActiveTintColor: "#EAE6FF", // Moonlight white-lavender
    tabBarInactiveTintColor: "rgba(168, 156, 200, 0.55)",

    tabBarStyle: {
      borderTopColor: "rgba(80, 79, 81, 0.1)",
      borderTopWidth: 1,

      backgroundColor: "transparent",

      elevation: 0,
      shadowOpacity: 0,
      paddingBottom: 10,
    },

    tabBarLabelStyle: {
      fontFamily: "AlmendraDisplay_400Regular",
      fontSize: 12,
      letterSpacing: 1.5,
      textShadowColor: "rgba(255,255,255,0.15)",

      textShadowOffset: {
        width: 0,
        height: 1,
      },

      textShadowRadius: 6,
    },

    tabBarBackground: () => (
      <View style={{ flex: 1 }}>
        {/* Moonlight reflection line */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "rgba(101, 138, 249, 0.06)",
            zIndex: 10,
          }}
        />

        <LinearGradient
          colors={[
            "#03101a", // dusk purple
            "#050505", // midnight violet
            "#101014", // dark charcoal
            "#050505", // deep black
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>
    ),
  },
  aspire: {
    tabBarActiveTintColor: "#FFFFFF",
    tabBarInactiveTintColor: "rgba(200, 200, 255, 0.4)",

    tabBarStyle: {
      backgroundColor: "transparent",
      borderTopWidth: 0,
      position: "absolute",
      left: 30,
      right: 30,
      borderRadius: 20,
      elevation: 15,
      shadowColor: "#54168e",
      shadowOpacity: 0.4,
      shadowRadius: 20,
    },

    tabBarLabelStyle: {
      fontFamily: "Syne_600SemiBold",
      fontSize: 10,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginTop: 2,
    },

    tabBarBackground: () => (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, overflow: "hidden" }}>
        {/* NEBULA BASE */}
        <LinearGradient
          colors={["rgba(40, 20, 80, 0.85)", "rgba(15, 5, 30, 0.95)"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* STARDUST GLOW */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.15)", "transparent"]}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* 1. DISTANT CLUSTERS (Low Opacity / 1px) */}
        <View style={{ position: "absolute", top: 15, left: 50, width: 1, height: 1, backgroundColor: "#FFF", opacity: 0.3 }} />
        <View style={{ position: "absolute", top: 40, left: 110, width: 1, height: 1, backgroundColor: "#FFF", opacity: 0.2 }} />
        <View style={{ position: "absolute", bottom: 15, right: 100, width: 1, height: 1, backgroundColor: "#FFF", opacity: 0.4 }} />
        <View style={{ position: "absolute", top: 25, left: 200, width: 1, height: 1, backgroundColor: "#FFF", opacity: 0.3 }} />

        {/* 2. MID-GROUND STARS (Varying Tints) */}
        <View style={{ position: "absolute", top: 10, left: 25, width: 2, height: 2, borderRadius: 1, backgroundColor: "#FFFFFF" }} />
        <View style={{ position: "absolute", top: 22, left: 70, width: 3, height: 3, borderRadius: 2, backgroundColor: "#E8E8FF" }} />
        <View style={{ position: "absolute", top: 14, left: 130, width: 2, height: 2, borderRadius: 1, backgroundColor: "#FFFFFF" }} />
        <View style={{ position: "absolute", top: 45, left: 40, width: 2, height: 2, borderRadius: 1, backgroundColor: "#D0D0FF", opacity: 0.6 }} />

        {/* 3. BOLD FOREGROUND STARS */}
        <View style={{ position: "absolute", top: 28, left: 180, width: 3, height: 3, borderRadius: 2, backgroundColor: "#FFFFFF" }} />
        <View style={{ position: "absolute", top: 12, right: 120, width: 2, height: 2, borderRadius: 1, backgroundColor: "#EAEAFF" }} />
        <View style={{ position: "absolute", top: 24, right: 85, width: 3, height: 3, borderRadius: 2, backgroundColor: "#FFFFFF" }} />
        <View style={{ position: "absolute", top: 35, right: 160, width: 2, height: 2, borderRadius: 1, backgroundColor: "#FFF", opacity: 0.8 }} />

        {/* 4. THE NORTH STAR (The Anchor) */}
        <View
          style={{
            position: "absolute",
            top: 16,
            right: 150,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
            // Halo effect
            shadowColor: "#FFFFFF",
            shadowOpacity: 0.8,
            shadowRadius: 5,
          }}
        />

        {/* 5. TINY ACCENT STARS */}
        <View style={{ position: "absolute", top: 9, right: 45, width: 2, height: 2, borderRadius: 1, backgroundColor: "#FFFFFF" }} />
        <View style={{ position: "absolute", top: 30, right: 20, width: 2, height: 2, borderRadius: 1, backgroundColor: "#D8D8FF" }} />
        <View style={{ position: "absolute", bottom: 10, left: 100, width: 1.5, height: 1.5, borderRadius: 1, backgroundColor: "#FFF", opacity: 0.5 }} />

        {/* GLASS RIM */}
        <View
          style={{
            height: 1,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            width: "80%",
            alignSelf: "center",
            position: "absolute",
            top: 0,
          }}
        />
      </View>
    ),
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
