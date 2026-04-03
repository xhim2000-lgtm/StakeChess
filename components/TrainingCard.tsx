import React, { useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const G = Colors.gaming;

interface TrainingCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  elo: string;
  compact?: boolean;
  onPress: () => void;
}

export function TrainingCard({ name, icon, color, elo, compact, onPress }: TrainingCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, compact && styles.cardCompact, { borderColor: `${color}33` }]}
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={styles.glowLine}>
          <View style={[styles.glowLineFill, { backgroundColor: color }]} />
        </View>
        <View style={styles.inner}>
          <View style={[styles.iconWrap, { borderColor: color }, compact && styles.iconWrapCompact]}>
            <Ionicons name={icon as any} size={compact ? 24 : 32} color={color} />
          </View>
          <Text style={[styles.name, { color }]}>{name}</Text>
          <Text style={styles.elo}>Elo {elo}</Text>
          <View style={[styles.playBtn, { backgroundColor: color }]}>
            <Ionicons name="play" size={12} color={G.bg} />
            <Text style={styles.playText}>JOUER</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardCompact: {
    width: 160,
    height: 190,
  },
  glowLine: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  glowLineFill: {
    height: '100%',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 1,
  },
  inner: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  iconWrapCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  elo: {
    color: G.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 4,
  },
  playText: {
    color: G.bg,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
