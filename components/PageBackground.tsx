import React, { ReactNode } from 'react';
import { ImageBackground, View, StyleSheet, ImageSourcePropType } from 'react-native';

const backgrounds: Record<string, ImageSourcePropType> = {
  main: require('@/assets/images/background-main.png'),
  france: require('@/assets/images/background-france.png'),
  game: require('@/assets/images/background-game.jpg'),
  dark: require('@/assets/images/background-dark.jpg'),
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
