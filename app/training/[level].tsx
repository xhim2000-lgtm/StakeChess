import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { GameLayout } from '@/components/GameLayout';
import { getAIMoveAsync, initAIEngine, destroyAIEngine, isStockfishReady } from '@/utils/chessAI';
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
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [engineStatus, setEngineStatus] = useState<'loading' | 'stockfish' | 'fallback'>('loading');
  const [, setTick] = useState(0);
  const aiThinking = useRef(false);

  // Initialize Stockfish engine on mount
  useEffect(() => {
    initAIEngine().then((available) => {
      setEngineStatus(available ? 'stockfish' : 'fallback');
    });
    return () => {
      destroyAIEngine();
    };
  }, []);

  const opponent = {
    name: isStockfishReady() ? 'Stockfish' : 'Chess AI',
    level: config.name.toUpperCase(),
    elo: config.elo,
    avatar: 'AI',
    avatarColor: config.color,
    isAI: true,
    aiIcon: config.icon,
  };
  const player = {
    name: 'Vous',
    level: 'NIVEAU 12',
    elo: 1850,
    avatar: 'VS',
    avatarColor: G.gold,
  };

  const syncHistory = useCallback(() => {
    const history = game.history();
    setMoveHistory([...history]);
    const moves = game.history({ verbose: true });
    const last = moves[moves.length - 1];
    if (last) setLastMove({ from: last.from, to: last.to });
    setTick(t => t + 1);
  }, [game]);

  const playAI = useCallback(async () => {
    if (game.isGameOver() || game.turn() !== 'b' || aiThinking.current) return;
    aiThinking.current = true;
    setTick(t => t + 1);

    // Small delay for natural feel
    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

    try {
      const move = await getAIMoveAsync(game, aiLevel);
      if (move) game.move(move);
    } catch {
      // Fallback: play random legal move
      const moves = game.moves();
      if (moves.length > 0) game.move(moves[Math.floor(Math.random() * moves.length)]);
    }

    aiThinking.current = false;
    syncHistory();

    if (game.isGameOver()) {
      setGameOver(true);
      if (game.isCheckmate()) {
        setResult(game.turn() === 'w' ? 'Défaite...' : 'Victoire !');
      } else {
        setResult('Partie nulle');
      }
    }
  }, [game, aiLevel, syncHistory]);

  const handleMove = useCallback(() => {
    syncHistory();
    if (!game.isGameOver()) playAI();
  }, [game, playAI, syncHistory]);

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
    setMoveHistory([]);
    setLastMove(null);
    setWhiteTime(600);
    setBlackTime(600);
    aiThinking.current = false;
    setTick(t => t + 1);
  };

  const handleResign = () => {
    Alert.alert('Abandonner', 'Voulez-vous vraiment abandonner ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: () => handleGameEnd('black') },
    ]);
  };

  const handleDrawOffer = () => {
    Alert.alert('Proposition de nulle', 'Nulle acceptée (simulation).', [
      { text: 'OK', onPress: () => handleGameEnd('draw') },
    ]);
  };

  const bottomExtra = (
    <View style={extraStyles.statusBlock}>
      {/* Engine status indicator */}
      <View style={extraStyles.engineRow}>
        <View style={[extraStyles.engineDot, {
          backgroundColor: engineStatus === 'stockfish' ? G.green : engineStatus === 'loading' ? G.gold : G.textMuted,
        }]} />
        <Text style={extraStyles.engineText}>
          {engineStatus === 'stockfish' ? 'STOCKFISH' : engineStatus === 'loading' ? 'CHARGEMENT...' : 'MOTEUR LOCAL'}
        </Text>
      </View>

      {gameOver && (
        <View style={extraStyles.resultBlock}>
          <Text style={[extraStyles.resultText, {
            color: result.includes('Victoire') ? G.gold : result.includes('Défaite') ? G.red : G.textSecondary,
          }]}>
            {result}
          </Text>
          <TouchableOpacity style={extraStyles.restartBtn} onPress={handleRestart}>
            <Ionicons name="reload" size={12} color={G.bg} />
            <Text style={extraStyles.restartText}>REJOUER</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={extraStyles.backText}>Retour</Text>
          </TouchableOpacity>
        </View>
      )}

      {aiThinking.current && !gameOver && (
        <Text style={extraStyles.thinkingText}>Réflexion en cours...</Text>
      )}
    </View>
  );

  return (
    <GameLayout
      game={game}
      opponent={opponent}
      player={player}
      whiteTime={whiteTime}
      blackTime={blackTime}
      isWhiteTurn={game.turn() === 'w'}
      gameActive={!gameOver}
      moveHistory={moveHistory}
      onGameEnd={handleGameEnd}
      onMove={handleMove}
      onResign={handleResign}
      onDrawOffer={handleDrawOffer}
      lastMove={lastMove}
      locked={aiThinking.current || game.turn() === 'b'}
      bottomExtra={bottomExtra}
    />
  );
}

const extraStyles = StyleSheet.create({
  statusBlock: { alignItems: 'center', gap: 6, marginTop: 4 },
  engineRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  engineDot: { width: 6, height: 6, borderRadius: 3 },
  engineText: {
    color: G.textMuted, fontSize: 8, fontWeight: '700', letterSpacing: 1,
  },
  resultBlock: { alignItems: 'center', gap: 6, marginTop: 4 },
  resultText: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  restartBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: G.gold, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8,
  },
  restartText: { color: G.bg, fontWeight: '800', fontSize: 10, letterSpacing: 0.5 },
  backText: { color: G.textMuted, fontSize: 11, fontWeight: '600' },
  thinkingText: {
    color: G.gold, fontSize: 10, fontWeight: '600', fontStyle: 'italic',
  },
});
