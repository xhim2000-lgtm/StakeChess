import { Stack } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

const G = Colors.gaming;

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: G.bg },
          headerTintColor: G.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: G.bg },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="online/[id]/index" options={{ headerShown: false }} />
        <Stack.Screen name="online/[id]/leaderboard" options={{ headerShown: false }} />
        <Stack.Screen name="game/[matchId]" options={{ headerShown: false }} />
        <Stack.Screen name="training/[level]" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
