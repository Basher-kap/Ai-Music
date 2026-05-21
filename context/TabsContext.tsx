// context/TabContext.tsx
import { LinearGradient } from "expo-linear-gradient";
import { ThemeKey, useTheme } from "./ThemeContext";
import { View } from "react-native";
import React from "react";

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
      elevation: 0, 
      backgroundColor: 'transparent',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    
    tabBarLabelStyle: {
      fontFamily: "Fredoka_600SemiBold",
      fontSize: 8,
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
      borderRadius: 20,
      shadowColor: "#54168e",
      shadowOpacity: 0.4,
      shadowRadius: 20,
    },

    tabBarLabelStyle: {
      fontFamily: "Syne_600SemiBold",
      fontSize: 8,
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
    tabBarActiveTintColor: "#c35e0c", 
    tabBarInactiveTintColor: "rgba(255, 255, 255, 0.3)",
  
  tabBarStyle: {
    backgroundColor: "#0A0A0A", 
    borderTopWidth: 0,
    shadowColor: "#ff8400",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  
  tabBarLabelStyle: {
    fontFamily: "RussoOne_400Regular",
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  tabBarBackground: () => (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F0F0F' }}>
      {/* 1. MISTY TEXTURE (Subtle Heat) */}
      <LinearGradient
        colors={["rgba(255, 49, 49, 0.05)", "transparent"]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* 2. ACTION LINES (Momentum) */}
      {[...Array(15)].map((_, i) => (
        <View 
          key={i}
          style={{
            position: 'absolute',
            left: i * 30,
            width: 2,
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.02)',
            transform: [{ skewX: '-20deg' }]
          }} 
        />
      ))}

      {/* 3. THE REDLINE ACCENT */}
      <View 
        style={{ 
          height: 3, 
          backgroundColor: "#ff5331", 
          width: '30%', 
          position: 'absolute', 
          top: 0,
          left: '35%', // Focused in the center
          shadowColor: "#ff8400",
          shadowOpacity: 0.9,
          shadowRadius: 8,
        }} 
      />
    </View>
    ),
  },
  wrath: {
    tabBarActiveTintColor: "#FFFFFF", // Pure white for a sharp "glint"
    tabBarInactiveTintColor: "rgba(216, 27, 17, 0.73)", // Dim red "embers"
    
    tabBarStyle: {
      backgroundColor: "#000000", 
      borderTopWidth: 0, 
    },
    
    tabBarLabelStyle: {
      fontFamily: "MetalMania_400Regular",
      fontSize: 8,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },

    tabBarBackground: () => (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' }}>
        {/* 1. THE HEAT VENT (Deep Red Glow) */}
        <LinearGradient
          colors={["#ff0000a0", "#660000", "#000000"]}
          style={{ position: 'absolute', top: 0, height: 20, width: '100%' }}
        />

        {/* 2. THE HAZARD STRIPES (Aggressive & Visible) */}
        <View style={{ position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, flexDirection: 'row', opacity: 0.1 }}>
          {[...Array(10)].map((_, i) => (
            <View 
              key={i}
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: '#FF0000',
                marginHorizontal: 1,
                transform: [{ skewX: '-25deg' }]
              }} 
            />
          ))}
        </View>

        {/* 3. ACTIVE TAB "GLOW" (Centrally focused) */}
        <LinearGradient
          colors={["rgba(255, 0, 0, 0.3)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', bottom: -30, left: '25%', width: '50%', height: 100, borderRadius: 50 }}
        />

        {/* 4. TOP EDGE SCAR */}
        <View 
          style={{ 
            height: 1, 
            backgroundColor: "#9f0c0c", 
            width: '100%', 
            position: 'absolute', 
            shadowColor: "#4b0d0d",
            shadowOpacity: 1,
            shadowRadius: 15,
          }} 
        />
      </View>
    ),
  },
};

export function useTabTheme() {
  const { activeTheme } = useTheme();
  const tabStyles = activeTheme ? tabThemeStyles[activeTheme] : {};
  return { tabStyles };
}
