import React, { ReactNode } from 'react';
import { ImageBackground, View, StyleSheet, Platform, ImageSourcePropType } from 'react-native';

const isWeb = Platform.OS === 'web';

const backgrounds: Record<string, ImageSourcePropType> = isWeb
  ? {
      main: { uri: '/backgrounds/background-main.png' },
      france: { uri: '/backgrounds/background-france.png' },
      game: { uri: '/backgrounds/background-game.png' },
      dark: { uri: '/backgrounds/background-dark.png' },
    }
  : {
      main: require('@/assets/images/background-main.png'),
      france: require('@/assets/images/background-france.png'),
      game: require('@/assets/images/background-game.png'),
      dark: require('@/assets/images/background-dark.png'),
    };

interface PageBackgroundProps {
  children: ReactNode;
  variant?: 'main' | 'france' | 'game' | 'dark';
  overlay?: number;
}

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
