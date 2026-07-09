// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTabTheme } from '@/context';
import { Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import type { ReactNode } from 'react';

function WebUnmountOnBlur({ children }: { children: ReactNode }) {
  const isFocused = useIsFocused();
  if (Platform.OS === 'web' && !isFocused) return null;
  return <>{children}</>;
}

export default function TabLayout() {
  const { tabStyles } = useTabTheme();
  return (
    <Tabs
      screenOptions={{
        ...tabStyles,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
      screenLayout={({ children }) => <WebUnmountOnBlur>{children}</WebUnmountOnBlur>}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="songs"
        options={{
          title: 'Songs',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'musical-notes' : 'musical-notes-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="theme"
        options={{
          title: 'Theme',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'color-palette' : 'color-palette-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}