// context/TabContext.tsx
import { LinearGradient } from "expo-linear-gradient";
import { ThemeKey, useTheme } from "./ThemeContext";
import { View } from "react-native";
import React from "react";

const tabThemeStyles: Record<ThemeKey, any> = {
  nostalgia: {
    tabBarActiveTintColor: "#1B3022", 
    tabBarInactiveTintColor: "rgba(27, 48, 34, 0.5)", 
    
    tabBarStyle: {
      backgroundColor: '#7aaf5bc1', 
      borderTopWidth: 2,
      borderTopColor: "rgba(255, 255, 255, 0.3)", 
      shadowColor: '#1B3022',
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    
    tabBarLabelStyle: {
      fontFamily: "Marcellus_400Regular",
      fontSize: 9,
      letterSpacing: 1.5,
      textTransform: 'lowercase', 
      textShadowColor: 'rgb(109, 214, 93)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 30,
    },

    tabBarBackground: () => (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        {/* 1. THE ORGANIC GRADIENT (Nature Tones) */}
        <LinearGradient
          colors={["#A8D08D", "#76A68F", "#548687"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />

        {/* 2. THE "TEXTURE" (Simulated Paper Grain/Noise) */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.08 }}>
          {[...Array(6)].map((_, i) => (
            <View 
              key={i}
              style={{
                position: 'absolute',
                top: i * 15,
                width: '100%',
                height: 1,
                backgroundColor: '#465f3c', // Horizontal "Grain" lines
              }} 
            />
          ))}
        </View>

        {/* 3. VINTAGE VIGNETTE (Darkened corners for an old-photo feel) */}
        <LinearGradient
          colors={["rgba(27, 48, 34, 0.15)", "transparent", "rgba(27, 48, 34, 0.15)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </View>
    ),
  },
  refreshing: {
    tabBarActiveTintColor: "#006064", 
    tabBarInactiveTintColor: "rgba(0, 96, 100, 0.4)", 
    
    tabBarStyle: {
      backgroundColor: 'transparent', 
      borderTopWidth: 0, 
    },
    
    tabBarLabelStyle: {
      fontFamily: "PlaywriteGBS_400Regular",
      fontSize: 9,
      letterSpacing: 0.5,
      textTransform: 'lowercase',
      textShadowColor: 'rgba(0, 206, 209, 0.6)', 
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },

    tabBarBackground: () => (
      <View style={{ flex: 1 }}>
        {/* 1. CRYSTAL BASE: Horizontal gradient mimicking a shoreline */}
        <LinearGradient
          colors={["#E0F7FA", "#B2EBF2", "#80DEEA"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* 2. THE "DEW" OVERLAY: Top-to-bottom transparency */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.7)", "transparent"]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}
        />

        {/* 3. REFRACTIVE LIGHT: A diagonal "sunlight-on-water" glint */}
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 0.4)", "transparent"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* 4. WATER DROPLETS (Procedural condensation) */}
        <View style={{ position: 'absolute', top: 10, left: '15%', width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', opacity: 0.3 }} />
        <View style={{ position: 'absolute', top: 25, right: '20%', width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', opacity: 0.2 }} />
        <View style={{ position: 'absolute', bottom: 15, left: '40%', width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#FFF', opacity: 0.4 }} />

        {/* 5. FROSTED TOP EDGE */}
        <View 
          style={{ 
            height: 1.5, 
            backgroundColor: "rgba(255, 255, 255, 0.8)", 
            width: '100%', 
            position: 'absolute', 
            top: 0,
            shadowColor: "#FFF",
            shadowOpacity: 0.5,
            shadowRadius: 5,
          }} 
        />
      </View>
    ),
  },
  love: {
    tabBarActiveTintColor: "#880E4F", 
    tabBarInactiveTintColor: "rgba(173, 20, 87, 0.4)", 
    
    tabBarStyle: {
      backgroundColor: '#FFF0F5', 
      borderTopWidth: 0, 
      shadowColor: '#AD1457',
      shadowOpacity: 0.2,
      shadowRadius: 10,
    },
    
    tabBarLabelStyle: {
      fontFamily: "DancingScript_600SemiBold",
      fontSize: 11, 
      letterSpacing: 0,
    },

    tabBarBackground: () => (
      <View style={{ flex: 1, backgroundColor: '#FFD1DC' }}>
        {/* 1. BASE LAYER: Soft Blush Gradient */}
        <LinearGradient
          colors={["#FFF0F5", "#FFD1DC", "#F48FB1"]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* 2. SILK SHINE: A soft white diagonal "sweep" */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.5)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* 3. BOKEH HEARTS (Enhanced Procedural soft circles) */}
        <View style={{ position: 'absolute', top: 5, left: '5%', width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(249, 143, 143, 0.8)', opacity: 0.4 }} />
        <View style={{ position: 'absolute', top: -9, left: '25%', width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#ab2a55', opacity: 0.2 }} />
        <View style={{ position: 'absolute', top: 20, left: '45%', width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(242, 170, 170, 0.6)', opacity: 0.5 }} />
        <View style={{ position: 'absolute', bottom: 10, right: '35%', width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(248, 192, 235, 0.9)', opacity: 0.4 }} />
        <View style={{ position: 'absolute', top: 15, right: '10%', width: 18, height: 18, borderRadius: 9, backgroundColor: '#AD1457', opacity: 0.25 }} />
        <View style={{ position: 'absolute', bottom: 20, right: '5%', width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'rgba(240, 126, 126, 0.5)', opacity: 0.4 }} />
        <View style={{ position: 'absolute', top: -5, left: '64%', width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(244, 143, 177, 0.7)', opacity: 0.3 }} />
              {/* 4. SOFT LACE TOP BORDER */}
        <View 
          style={{ 
            height: 3, 
            backgroundColor: "rgba(255, 255, 255, 0.6)", 
            width: '100%', 
            position: 'absolute', 
            top: 0,
            shadowColor: "#221719",
            shadowOpacity: 1,
            shadowRadius: 10,
          }} 
        />
      </View>
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
    tabBarInactiveTintColor: "rgba(195, 187, 217, 0.4)",

    tabBarStyle: {
      backgroundColor: "transparent",
      borderTopWidth: 0, 
      paddingBottom: 10,
    },

    tabBarLabelStyle: {
      fontFamily: "AlmendraDisplay_400Regular",
      letterSpacing: 2,
      textShadowColor: "rgba(168, 156, 200, 0.6)",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },

    tabBarBackground: () => (
      <View style={{ flex: 1, backgroundColor: '#050505', overflow: 'hidden' }}>
        {/* 1. THE DEEP NIGHT GRADIENT */}
        <LinearGradient
          colors={["#0A0A12", "#050505", "#f4f1f1"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* 2. MIDNIGHT MIST: A soft purple glow from the bottom */}
        <LinearGradient
          colors={["transparent", "rgba(97, 85, 129, 0.2)"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {/* 3. "FALLING RAIN" (Thin vertical needles) */}
        {[...Array(12)].map((_, i) => (
          <View 
            key={i}
            style={{
              position: 'absolute',
              top: (i * 7) % 40, 
              left: (i * 35),
              width: 1,
              height: 5,
              backgroundColor: 'rgba(234, 230, 255, 0.24)',
              opacity: 0.5,
            }} 
          />
        ))}

        {/* 4. LONELY MOONLIGHT: A sharp glint at the very top */}
        <LinearGradient
          colors={["rgba(247, 246, 253, 0.2)", "transparent"]}
          style={{ height: 1.5, width: '100%', position: 'absolute', top: 0 }}
        />

        {/* 5. GOTHIC CORNERS (Vignette) */}
        <LinearGradient
          colors={["rgba(0, 4, 19, 0.8)", "transparent", "rgba(1, 10, 28, 0.8)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
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

        <LinearGradient
          colors={["rgba(188, 7, 7, 0.36)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', bottom: -30, left: '88%', width: '20%', height: 100, borderRadius: 50 }}
        />

        <LinearGradient
          colors={["rgba(199, 6, 6, 0.3)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: 'absolute', bottom: -30, right: '88%', width: '20%', height: 100, borderRadius: 50 }}
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
