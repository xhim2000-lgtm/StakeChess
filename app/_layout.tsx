import { Stack } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { View, ImageBackground, StyleSheet } from 'react-native';

const G = Colors.gaming;

const G = Colors.gaming;

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="light" />
      <ImageBackground
        source={require('@/assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Dark overlay for readability */}
        <View style={styles.overlay}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: 'transparent' },
              headerTintColor: G.textPrimary,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: 'transparent' },
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="online/[id]/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="online/[id]/leaderboard"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="game/[matchId]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="training/[level]"
              options={{ headerShown: false }}
            />
          </Stack>
        </View>
      </ImageBackground>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
});
