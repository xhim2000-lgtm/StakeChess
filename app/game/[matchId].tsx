import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ChessBoard } from '@/components/ChessBoard';
import { getPlayerById } from '@/data/players';

export default function GameScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  // Parse matchId: format is "tournamentId-rRound" e.g. "t2-r3"
  const opponent = getPlayerById('p1') ?? {
    pseudo: 'Adversaire',
    elo: 1800,
    avatar: 'AD',
    avatarColor: Colors.textSecondary,
  };

  // Timer state (simulated blitz: 3 min each)
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
        setWhiteTime(prev => {
          if (prev <= 1) {
            setGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            setGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isWhiteTurn, gameActive]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleGameEnd = (result: 'white' | 'black' | 'draw') => {
    setGameActive(false);
  };

  return (
    <View style={styles.container}>
      {/* Opponent info (black) */}
      <View style={styles.playerBar}>
        <View style={styles.playerInfo}>
          <View style={[styles.avatar, { backgroundColor: opponent.avatarColor }]}>
            <Text style={styles.avatarText}>{'avatar' in opponent ? opponent.avatar : 'AD'}</Text>
          </View>
          <View>
            <Text style={styles.playerName}>{opponent.pseudo}</Text>
            <Text style={styles.playerElo}>{'elo' in opponent ? opponent.elo : 1800}</Text>
          </View>
        </View>
        <View style={[styles.timer, !isWhiteTurn && gameActive && styles.timerActive]}>
          <Text style={[styles.timerText, !isWhiteTurn && gameActive && styles.timerTextActive]}>
            {formatTime(blackTime)}
          </Text>
        </View>
      </View>

      {/* Board */}
      <View style={styles.boardContainer}>
        <ChessBoard onGameEnd={handleGameEnd} />
      </View>

      {/* Your info (white) */}
      <View style={styles.playerBar}>
        <View style={styles.playerInfo}>
          <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
            <Text style={styles.avatarText}>VS</Text>
          </View>
          <View>
            <Text style={styles.playerName}>Vous</Text>
            <Text style={styles.playerElo}>1850</Text>
          </View>
        </View>
        <View style={[styles.timer, isWhiteTurn && gameActive && styles.timerActive]}>
          <Text style={[styles.timerText, isWhiteTurn && gameActive && styles.timerTextActive]}>
            {formatTime(whiteTime)}
          </Text>
        </View>
      </View>

      <Text style={styles.matchInfo}>Match: {matchId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  playerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  playerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  playerElo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  timer: {
    backgroundColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timerActive: {
    backgroundColor: Colors.primary,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  timerTextActive: {
    color: Colors.white,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  matchInfo: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 8,
  },
});
