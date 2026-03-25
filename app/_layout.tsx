import { Stack } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="online/[id]/index"
          options={{ title: 'Détail tournoi', headerBackTitle: 'Retour' }}
        />
        <Stack.Screen
          name="online/[id]/leaderboard"
          options={{ title: 'Classement', headerBackTitle: 'Retour' }}
        />
        <Stack.Screen
          name="game/[matchId]"
          options={{ title: 'Partie en cours', headerBackTitle: 'Retour' }}
        />
      </Stack>
    </UserProvider>
  );
}
