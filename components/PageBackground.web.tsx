import { View, StyleSheet } from 'react-native';
import { ReactNode, CSSProperties } from 'react';

interface PageBackgroundProps {
  children: ReactNode;
  variant?: 'main' | 'france' | 'game' | 'profile' | 'dark';
  overlay?: number;
}

export function PageBackground({
  children,
  variant = 'dark',
  overlay = 0.7
}: PageBackgroundProps) {
  const backgrounds: Record<string, string> = {
    main: 'https://res.cloudinary.com/dlirpp7kl/image/upload/f_auto,q_auto/background-main.png',
    profile: 'https://res.cloudinary.com/dlirpp7kl/image/upload/f_auto,q_auto/background-profil.png',
    france: 'https://res.cloudinary.com/dlirpp7kl/image/upload/f_auto,q_auto/background-main.png',
    game: 'https://res.cloudinary.com/dlirpp7kl/image/upload/f_auto,q_auto/background-main.png',
    dark: 'https://res.cloudinary.com/dlirpp7kl/image/upload/f_auto,q_auto/background-main.png',
  };

  const containerStyle: CSSProperties = {
    flex: 1,
    backgroundImage: `url(${backgrounds[variant]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
  };

  const overlayStyle: CSSProperties = {
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, ${overlay})`,
  };

  return (
    <div style={containerStyle}>
      <View style={[styles.overlay, overlayStyle as any]}>
        {children}
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
});
