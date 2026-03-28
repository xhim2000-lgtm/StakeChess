import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GameLayout } from '@/components/GameLayout';
import { getPlayerById } from '@/data/players';
import { Chess } from 'chess.js';

const G = Colors.gaming;

export default function GameScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  const opp = getPlayerById('p1');
  const opponent = {
    name: opp?.pseudo ?? 'OPPONENT_01',
    level: 'NIVEAU 11',
    elo: opp?.elo ?? 1650,
    avatar: opp?.avatar ?? 'AD',
    avatarColor: opp?.avatarColor ?? G.textMuted,
  };
  const player = {
    name: 'Vous',
    level: 'NIVEAU 12',
    elo: 1850,
    avatar: 'VS',
    avatarColor: G.gold,
  };

  const [game] = useState(() => new Chess());
  const [whiteTime, setWhiteTime] = useState(600); // 10 min
  const [blackTime, setBlackTime] = useState(600);
  const [gameActive, setGameActive] = useState(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isWhiteTurn = game.turn() === 'w';

  useEffect(() => {
    if (!gameActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (game.turn() === 'w') {
        setWhiteTime(prev => { if (prev <= 1) { setGameActive(false); return 0; } return prev - 1; });
      } else {
        setBlackTime(prev => { if (prev <= 1) { setGameActive(false); return 0; } return prev - 1; });
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameActive, game]);

  const handleMove = useCallback(() => {
    const history = game.history();
    setMoveHistory([...history]);
    const moves = game.history({ verbose: true });
    const last = moves[moves.length - 1];
    if (last) setLastMove({ from: last.from, to: last.to });
    setTick(t => t + 1);
  }, [game]);

  const handleGameEnd = useCallback((result: 'white' | 'black' | 'draw') => {
    setGameActive(false);
  }, []);

  const handleResign = () => {
    Alert.alert('Abandonner', 'Voulez-vous vraiment abandonner ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: () => { setGameActive(false); } },
    ]);
  };

  const handleDrawOffer = () => {
    Alert.alert('Proposition de nulle', 'Nulle acceptée (simulation).', [
      { text: 'OK', onPress: () => setGameActive(false) },
    ]);
  };

  return (
    <GameLayout
      game={game}
      opponent={opponent}
      player={player}
      whiteTime={whiteTime}
      blackTime={blackTime}
      isWhiteTurn={isWhiteTurn}
      gameActive={gameActive}
      moveHistory={moveHistory}
      onGameEnd={handleGameEnd}
      onMove={handleMove}
      onResign={handleResign}
      onDrawOffer={handleDrawOffer}
      lastMove={lastMove}
    />
  );
}
