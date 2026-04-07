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
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          elevation: 10,
          backgroundColor: 'rgba(0,0,0,0.95)',
          borderTopColor: G.borderGold,
          borderTopWidth: 1,
          height: 56,
          paddingTop: 4,
          paddingBottom: 6,
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
        headerShown: false,
        sceneStyle: {
          backgroundColor: G.bg,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jouer',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>🎮</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="france"
        options={{
          title: 'Tournois',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>🏆</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
