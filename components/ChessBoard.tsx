import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Chess, Square, PieceSymbol } from 'chess.js';

const G = Colors.gaming;

const PIECE_UNICODE: Record<string, Record<PieceSymbol, string>> = {
  w: { p: '\u2659', r: '\u2656', n: '\u2658', b: '\u2657', q: '\u2655', k: '\u2654' },
  b: { p: '\u265F', r: '\u265C', n: '\u265E', b: '\u265D', q: '\u265B', k: '\u265A' },
};
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

function computeSquareSize() {
  const { width, height } = Dimensions.get('window');
  const boardSize = Math.min(height * 0.75, width * 0.45, 600);
  return Math.floor(boardSize / 8);
}

interface ChessBoardProps {
  game?: Chess;
  onMove?: () => void;
  onGameEnd?: (result: 'white' | 'black' | 'draw') => void;
  locked?: boolean;
  playerColor?: 'w' | 'b';
  lastMove?: { from: string; to: string } | null;
}

export function ChessBoard({
  game: externalGame,
  onMove,
  onGameEnd,
  locked,
  playerColor = 'w',
  lastMove,
}: ChessBoardProps) {
  const [internalGame] = useState(() => new Chess());
  const game = externalGame || internalGame;

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [, setTick] = useState(0);

  const squareSize = computeSquareSize();
  const boardSize = squareSize * 8;

  const files = playerColor === 'w' ? FILES : [...FILES].reverse();
  const ranks = playerColor === 'w' ? RANKS : [...RANKS].reverse();

  const handleSquarePress = useCallback((square: Square) => {
    if (game.isGameOver() || locked) return;
    if (externalGame && game.turn() !== playerColor) return;

    if (selectedSquare) {
      try {
        const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
          setTick(t => t + 1);
          setSelectedSquare(null);
          setLegalMoves([]);
          onMove?.();

          if (game.isGameOver()) {
            let result: 'white' | 'black' | 'draw' = 'draw';
            if (game.isCheckmate()) result = game.turn() === 'w' ? 'black' : 'white';
            onGameEnd?.(result);
          }
          return;
        }
      } catch {
        // Invalid move
      }
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to as Square));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [game, externalGame, selectedSquare, locked, playerColor, onMove, onGameEnd]);

  return (
    <View style={styles.container}>
      <View style={[styles.board, { width: boardSize + 32, }]}>
        {/* Top file labels */}
        <View style={styles.fileLabels}>
          <View style={styles.coordSpacer} />
          {files.map(f => (
            <Text key={f} style={[styles.coordLabel, { width: squareSize }]}>{f}</Text>
          ))}
          <View style={styles.coordSpacer} />
        </View>

        {ranks.map((rank) => (
          <View key={rank} style={styles.row}>
            <Text style={[styles.coordLabel, styles.coordSpacer]}>{rank}</Text>
            {files.map((file) => {
              const square = `${file}${rank}` as Square;
              const isLight = (parseInt(rank) + file.charCodeAt(0)) % 2 === 0;
              const piece = game.get(square);
              const isSelected = selectedSquare === square;
              const isLegal = legalMoves.includes(square);
              const isLastMoveFrom = lastMove?.from === square;
              const isLastMoveTo = lastMove?.to === square;
              const isCaptureLegal = isLegal && piece;
              const inCheck = game.inCheck() && piece?.type === 'k' && piece.color === game.turn();

              return (
                <TouchableOpacity
                  key={square}
                  style={[
                    {
                      width: squareSize,
                      height: squareSize,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    isLight ? styles.lightSquare : styles.darkSquare,
                    isSelected && styles.selectedSquare,
                    (isLastMoveFrom || isLastMoveTo) && styles.lastMoveSquare,
                    inCheck && styles.checkSquare,
                  ]}
                  onPress={() => handleSquarePress(square)}
                  activeOpacity={0.7}
                >
                  {piece && (
                    <Text style={{
                      fontSize: squareSize * 0.75,
                      lineHeight: squareSize,
                      textAlign: 'center',
                      textShadowColor: 'rgba(0,0,0,0.2)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {PIECE_UNICODE[piece.color][piece.type]}
                    </Text>
                  )}
                  {isLegal && !piece && (
                    <View style={{
                      width: squareSize * 0.25,
                      height: squareSize * 0.25,
                      borderRadius: squareSize * 0.125,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                    }} />
                  )}
                  {isCaptureLegal && (
                    <View style={{
                      position: 'absolute',
                      width: squareSize - 4,
                      height: squareSize - 4,
                      borderRadius: (squareSize - 4) / 2,
                      borderWidth: 3,
                      borderColor: 'rgba(212,175,55,0.6)',
                    }} />
                  )}
                </TouchableOpacity>
              );
            })}
            <Text style={[styles.coordLabel, styles.coordSpacer]}>{rank}</Text>
          </View>
        ))}

        {/* Bottom file labels */}
        <View style={styles.fileLabels}>
          <View style={styles.coordSpacer} />
          {files.map(f => (
            <Text key={f} style={[styles.coordLabel, { width: squareSize }]}>{f}</Text>
          ))}
          <View style={styles.coordSpacer} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: G.gold,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: G.bgSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileLabels: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordSpacer: {
    width: 16,
  },
  coordLabel: {
    textAlign: 'center',
    fontSize: 9,
    color: G.goldMuted,
    fontWeight: '600',
  },
  lightSquare: {
    backgroundColor: '#EDD6B0',
  },
  darkSquare: {
    backgroundColor: '#B88762',
  },
  selectedSquare: {
    backgroundColor: 'rgba(212,175,55,0.6)',
  },
  lastMoveSquare: {
    backgroundColor: 'rgba(212,175,55,0.25)',
  },
  checkSquare: {
    backgroundColor: 'rgba(255,61,61,0.5)',
  },
});
