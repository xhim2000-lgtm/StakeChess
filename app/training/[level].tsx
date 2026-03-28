import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ChessBoard } from '@/components/ChessBoard';
import { getAIMove } from '@/utils/chessAI';
import { Chess } from 'chess.js';

const G = Colors.gaming;

const levelConfig: Record<string, { name: string; elo: number; icon: string; color: string }> = {
  beginner: { name: 'Débutant', elo: 1200, icon: 'happy-outline', color: G.green },
  intermediate: { name: 'Intermédiaire', elo: 1800, icon: 'skull-outline', color: G.gold },
  expert: { name: 'Expert', elo: 2400, icon: 'flame-outline', color: G.red },
};

export default function TrainingScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const router = useRouter();
  const config = levelConfig[level] || levelConfig.beginner;
  const aiLevel = (level || 'beginner') as 'beginner' | 'intermediate' | 'expert';

  const [game] = useState(() => new Chess());
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState('');
  const [, setTick] = useState(0);
  const aiThinking = useRef(false);

  const playAI = useCallback(() => {
    if (game.isGameOver() || game.turn() !== 'b' || aiThinking.current) return;
    aiThinking.current = true;

    // Small delay to feel more natural
    setTimeout(() => {
      const move = getAIMove(game, aiLevel);
      if (move) {
        game.move(move);
        setTick(t => t + 1);
      }
      aiThinking.current = false;

      if (game.isGameOver()) {
        setGameOver(true);
        if (game.isCheckmate()) {
          setResult(game.turn() === 'w' ? 'Défaite...' : 'Victoire !');
        } else {
          setResult('Partie nulle');
        }
      }
    }, 300 + Math.random() * 500);
  }, [game, aiLevel]);

  const handleMove = useCallback(() => {
    // After player moves, let AI respond
    setTick(t => t + 1);
    if (!game.isGameOver()) {
      playAI();
    }
  }, [game, playAI]);

  const handleGameEnd = useCallback((res: 'white' | 'black' | 'draw') => {
    setGameOver(true);
    if (res === 'white') setResult('Victoire !');
    else if (res === 'black') setResult('Défaite...');
    else setResult('Partie nulle');
  }, []);

  const handleRestart = () => {
    game.reset();
    setGameOver(false);
    setResult('');
    setTick(t => t + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.landscapeRow}>
        {/* Left: AI info */}
        <View style={styles.sidePanel}>
          <View style={[styles.aiAvatar, { borderColor: config.color }]}>
            <Ionicons name={config.icon as any} size={28} color={config.color} />
          </View>
          <Text style={styles.aiName}>Stockfish AI</Text>
          <Text style={[styles.aiLevel, { color: config.color }]}>{config.name}</Text>
          <Text style={styles.aiElo}>ELO {config.elo}</Text>
          <View style={[styles.badge, { borderColor: config.color }]}>
            <Ionicons name="hardware-chip-outline" size={12} color={config.color} />
            <Text style={[styles.badgeText, { color: config.color }]}>IA</Text>
          </View>
        </View>

        {/* Center: board */}
        <View style={styles.boardContainer}>
          <ChessBoard game={game} onGameEnd={handleGameEnd} onMove={handleMove} />
        </View>

        {/* Right: your info + result */}
        <View style={styles.sidePanel}>
          <View style={[styles.playerAvatar, { borderColor: G.gold }]}>
            <Text style={styles.playerAvatarText}>VS</Text>
          </View>
          <Text style={styles.playerName}>Vous</Text>
          <Text style={styles.playerElo}>ELO 1850</Text>

          {gameOver && (
            <View style={styles.resultBlock}>
              <Text style={[styles.resultText, {
                color: result.includes('Victoire') ? G.gold : result.includes('Défaite') ? G.red : G.textSecondary,
              }]}>
                {result}
              </Text>
              <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                <Ionicons name="reload" size={14} color={G.bg} />
                <Text style={styles.restartText}>REJOUER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>Retour</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg, padding: 10 },
  landscapeRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  sidePanel: { alignItems: 'center', gap: 6, width: 110 },
  aiAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: G.bgTertiary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  aiName: { fontSize: 14, fontWeight: '700', color: G.textPrimary },
  aiLevel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  aiElo: { fontSize: 10, color: G.textMuted },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  playerAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: G.bgTertiary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  playerAvatarText: { color: G.gold, fontSize: 16, fontWeight: '800' },
  playerName: { fontSize: 14, fontWeight: '700', color: G.textPrimary },
  playerElo: { fontSize: 10, color: G.gold },
  boardContainer: { justifyContent: 'center', alignItems: 'center' },
  resultBlock: { alignItems: 'center', gap: 8, marginTop: 12 },
  resultText: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  restartButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: G.gold, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
  },
  restartText: { color: G.bg, fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },
  backButton: { paddingVertical: 6 },
  backText: { color: G.textMuted, fontSize: 12, fontWeight: '600' },
});
