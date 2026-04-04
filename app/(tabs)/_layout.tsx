import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const G = Colors.gaming;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: G.gold,
        tabBarInactiveTintColor: G.textMuted,
        tabBarStyle: {
          backgroundColor: 'rgba(0,0,0,0.9)',
          borderTopColor: G.borderGold,
          borderTopWidth: 1,
          height: 50,
          paddingTop: 4,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: G.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          letterSpacing: 1,
        },
        sceneStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jouer',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="france"
        options={{
          title: 'France',
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 6 }}>🇫🇷</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="my-tournaments"
        options={{
          title: 'Mes Tournois',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size - 4} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
