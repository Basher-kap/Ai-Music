// app/(songs)/_layout.tsx
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTabTheme } from '@/context';

export default function SongDetailLayout() {
    const { tabStyles } = useTabTheme();
  return (
    <Tabs
      screenOptions={{
        ...tabStyles,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
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