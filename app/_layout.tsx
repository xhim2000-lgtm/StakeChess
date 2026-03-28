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
          headerStyle: { backgroundColor: G.bgSecondary },
          headerTintColor: G.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: G.bg },
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
        <Stack.Screen
          name="training/[level]"
          options={{ title: 'Entraînement', headerBackTitle: 'Retour' }}
        />
      </Stack>
    </UserProvider>
  );
}
