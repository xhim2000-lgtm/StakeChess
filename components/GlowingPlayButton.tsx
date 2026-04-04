import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const G = Colors.gaming;

interface GlowingPlayButtonProps {
  onPress: () => void;
  label?: string;
  compact?: boolean;
}

export function GlowingPlayButton({ onPress, label = 'JOUEZ !', compact = false }: GlowingPlayButtonProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulseAnim]);

  const haloOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  const haloScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <Animated.View
        style={[
          styles.halo,
          compact && styles.haloCompact,
          { opacity: haloOpacity, transform: [{ scale: haloScale }] },
        ]}
      />
      <TouchableOpacity
        style={[styles.button, compact && styles.buttonCompact]}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <Ionicons name="flash" size={compact ? 16 : 20} color={G.bg} />
        <Text style={[styles.text, compact && styles.textCompact]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  containerCompact: {
    width: 'auto',
  },
  halo: {
    position: 'absolute',
    width: '110%',
    height: '140%',
    borderRadius: 20,
    backgroundColor: G.glowGold,
  },
  haloCompact: {
    width: '115%',
    height: '150%',
    borderRadius: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: G.gold,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
    width: '100%',
    shadowColor: G.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonCompact: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: 'auto',
  },
  text: {
    color: G.bg,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  textCompact: {
    fontSize: 13,
    letterSpacing: 2,
  },
});
