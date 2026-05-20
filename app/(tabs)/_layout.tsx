// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import Ionicons from '@expo/vector-icons/Ionicons';



export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        sceneStyle: { backgroundColor: 'transparent' },

        tabBarStyle:{
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          borderTopWidth: 0, // Keeps it clean with your background
          elevation: 0,
        }
      }}
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
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}