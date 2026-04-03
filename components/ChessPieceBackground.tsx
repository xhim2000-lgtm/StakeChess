import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const G = Colors.gaming;

const PIECES = [
  { char: '\u265A', top: '5%', left: '8%', size: 48, rotation: '-12deg' },
  { char: '\u265B', top: '15%', right: '10%', size: 40, rotation: '8deg' },
  { char: '\u265C', top: '45%', left: '3%', size: 36, rotation: '-5deg' },
  { char: '\u265E', top: '65%', right: '5%', size: 44, rotation: '15deg' },
  { char: '\u265D', top: '80%', left: '12%', size: 32, rotation: '-8deg' },
  { char: '\u265F', top: '35%', right: '15%', size: 28, rotation: '10deg' },
];

const PIECES_DENSE = [
  ...PIECES,
  { char: '\u265A', top: '25%', left: '50%', size: 30, rotation: '20deg' },
  { char: '\u265C', top: '55%', left: '45%', size: 34, rotation: '-15deg' },
  { char: '\u265E', top: '75%', right: '40%', size: 38, rotation: '5deg' },
];

interface ChessPieceBackgroundProps {
  density?: 'sparse' | 'normal' | 'dense';
}

export function ChessPieceBackground({ density = 'normal' }: ChessPieceBackgroundProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacityAnim]);

  const baseOpacity = opacityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.03, 0.07],
  });

  const pieces = density === 'dense' ? PIECES_DENSE : density === 'sparse' ? PIECES.slice(0, 3) : PIECES;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.piece,
            {
              top: p.top as `${number}%`,
              left: (p as any).left as `${number}%` | undefined,
              right: (p as any).right as `${number}%` | undefined,
              fontSize: p.size,
              transform: [{ rotate: p.rotation }],
              opacity: baseOpacity,
            },
          ]}
        >
          {p.char}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    color: G.gold,
  },
});
