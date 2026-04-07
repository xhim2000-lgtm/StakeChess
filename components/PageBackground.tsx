import { ImageBackground, View, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface PageBackgroundProps {
  children: ReactNode;
  variant?: 'main' | 'france' | 'game' | 'profile' | 'dark';
  overlay?: number;
}

const backgrounds: Record<string, { uri: string }> = {
  main: {
    uri: 'https://res.cloudinary.com/dlirp7kl/image/upload/f_auto,q_auto/background-main.png',
  },
  profile: {
    uri: 'https://res.cloudinary.com/dlirp7kl/image/upload/f_auto,q_auto/background-profil.png',
  },
  france: {
    uri: 'https://res.cloudinary.com/dlirp7kl/image/upload/f_auto,q_auto/background-main.png',
  },
  game: {
    uri: 'https://res.cloudinary.com/dlirp7kl/image/upload/f_auto,q_auto/background-main.png',
  },
  dark: {
    uri: 'https://res.cloudinary.com/dlirp7kl/image/upload/f_auto,q_auto/background-main.png',
  },
};

export function PageBackground({
  children,
  variant = 'dark',
  overlay = 0.7,
}: PageBackgroundProps) {
  return (
    <ImageBackground
      source={backgrounds[variant]}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={[styles.overlay, { backgroundColor: `rgba(0,0,0,${overlay})` }]}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
});
