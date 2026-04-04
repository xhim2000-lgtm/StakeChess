import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GameLayout } from '@/components/GameLayout';
import { Chess } from 'chess.js';

const G = Colors.gaming;

export default function GameScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  const [game] = useState(() => new Chess());
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isWhiteTurn = game.turn() === 'w';

  // Timer countdown
  useEffect(() => {
    if (gameOver) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime(prev => {
          if (prev <= 1) { setGameOver(true); return 0; }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) { setGameOver(true); return 0; }
          return prev - 1;
        });
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameActive, game]);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isWhiteTurn, gameOver]);

  const opponent = {
    name: 'Adversaire',
    level: 'JOUEUR',
    elo: 1800,
    avatar: 'AD',
    avatarColor: G.purple,
  };

  const player = {
    name: 'Vous',
    level: 'NIVEAU 12',
    elo: 1850,
    avatar: 'VS',
    avatarColor: G.gold,
  };

  const syncHistory = useCallback(() => {
    setMoveHistory([...game.history()]);
    const moves = game.history({ verbose: true });
    const last = moves[moves.length - 1];
    if (last) setLastMove({ from: last.from, to: last.to });
    setTick(t => t + 1);
  }, [game]);

  const handleMove = useCallback(() => {
    syncHistory();
  }, [syncHistory]);

  const handleGameEnd = useCallback((result: 'white' | 'black' | 'draw') => {
    setGameOver(true);
  }, []);

  const handleResign = () => {
    Alert.alert('Abandonner', 'Voulez-vous vraiment abandonner ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: () => handleGameEnd('black') },
    ]);
  };

  const handleDrawOffer = () => {
    Alert.alert('Proposition de nulle', 'Nulle proposée à l\'adversaire.', [{ text: 'OK' }]);
  };

  return (
    <GameLayout
      game={game}
      opponent={opponent}
      player={player}
      whiteTime={whiteTime}
      blackTime={blackTime}
      isWhiteTurn={isWhiteTurn}
      gameActive={!gameOver}
      moveHistory={moveHistory}
      onGameEnd={handleGameEnd}
      onMove={handleMove}
      onResign={handleResign}
      onDrawOffer={handleDrawOffer}
      lastMove={lastMove}
    />
  );
}
