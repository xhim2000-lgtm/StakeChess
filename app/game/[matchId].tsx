import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ChessBoard } from '@/components/ChessBoard';
import { getPlayerById } from '@/data/players';

const G = Colors.gaming;

export default function GameScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  const opponent = getPlayerById('p1') ?? {
    pseudo: 'Adversaire', elo: 1800, avatar: 'AD', avatarColor: G.textMuted,
  };

  const [whiteTime, setWhiteTime] = useState(180);
  const [blackTime, setBlackTime] = useState(180);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameActive, setGameActive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!gameActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime(prev => { if (prev <= 1) { setGameActive(false); return 0; } return prev - 1; });
      } else {
        setBlackTime(prev => { if (prev <= 1) { setGameActive(false); return 0; } return prev - 1; });
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isWhiteTurn, gameActive]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      {/* Landscape: board center, player bars on sides */}
      <View style={styles.landscapeRow}>
        {/* Left: opponent */}
        <View style={styles.sidePanel}>
          <View style={[styles.avatar, { backgroundColor: opponent.avatarColor }]}>
            <Text style={styles.avatarText}>{'avatar' in opponent ? opponent.avatar : 'AD'}</Text>
          </View>
          <Text style={styles.playerName}>{opponent.pseudo}</Text>
          <Text style={styles.playerElo}>{'elo' in opponent ? opponent.elo : 1800}</Text>
          <View style={[styles.timer, !isWhiteTurn && gameActive && styles.timerActive]}>
            <Text style={[styles.timerText, !isWhiteTurn && gameActive && styles.timerTextActive]}>
              {formatTime(blackTime)}
            </Text>
          </View>
        </View>

        {/* Center: board */}
        <View style={styles.boardContainer}>
          <ChessBoard onGameEnd={() => setGameActive(false)} />
        </View>

        {/* Right: you */}
        <View style={styles.sidePanel}>
          <View style={[styles.avatar, { backgroundColor: Colors.gaming.gold }]}>
            <Text style={styles.avatarText}>VS</Text>
          </View>
          <Text style={styles.playerName}>Vous</Text>
          <Text style={styles.playerElo}>1850</Text>
          <View style={[styles.timer, isWhiteTurn && gameActive && styles.timerActive]}>
            <Text style={[styles.timerText, isWhiteTurn && gameActive && styles.timerTextActive]}>
              {formatTime(whiteTime)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.matchInfo}>Match: {matchId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg, padding: 10 },
  landscapeRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  sidePanel: { alignItems: 'center', gap: 6, width: 100 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: G.borderGold },
  avatarText: { color: G.bg, fontSize: 14, fontWeight: '700' },
  playerName: { fontSize: 14, fontWeight: '700', color: G.textPrimary },
  playerElo: { fontSize: 11, color: G.gold },
  timer: { backgroundColor: G.bgTertiary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: G.borderLight },
  timerActive: { backgroundColor: G.gold, borderColor: G.gold },
  timerText: { fontSize: 20, fontWeight: '700', color: G.textSecondary, fontVariant: ['tabular-nums'] },
  timerTextActive: { color: G.bg },
  boardContainer: { justifyContent: 'center', alignItems: 'center' },
  matchInfo: { textAlign: 'center', fontSize: 10, color: G.textMuted, marginTop: 6 },
});
