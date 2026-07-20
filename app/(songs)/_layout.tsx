// app/(songs)/_layout.tsx
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTabTheme } from '@/context';
import { Platform } from 'react-native';
import { useIsFocused } from 'expo-router';
import type { ReactNode } from 'react';

function WebUnmountOnBlur({ children }: { children: ReactNode }) {
  const isFocused = useIsFocused();
  if (Platform.OS === 'web' && !isFocused) return null;
  return <>{children}</>;
}

export default function SongDetailLayout() {
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
        name="[id]/lyrics"
        options={{
          title: 'Lyrics',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'newspaper' : 'newspaper-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="[id]/review"
        options={{
          title: 'Review',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'star' : 'star-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}