import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Chess, Square, PieceSymbol } from 'chess.js';

const G = Colors.gaming;
const { height: SCREEN_H } = Dimensions.get('window');
// Board fills available height minus padding/chrome — max 480
const BOARD_MAX = Math.min(SCREEN_H - 100, 480);
const SQ = Math.floor(BOARD_MAX / 8.6); // leave room for labels

const PIECE_UNICODE: Record<string, Record<PieceSymbol, string>> = {
  w: { p: '\u2659', r: '\u2656', n: '\u2658', b: '\u2657', q: '\u2655', k: '\u2654' },
  b: { p: '\u265F', r: '\u265C', n: '\u265E', b: '\u265D', q: '\u265B', k: '\u265A' },
};
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

interface ChessBoardProps {
  game: Chess;
  onMove?: () => void;
  onGameEnd?: (result: 'white' | 'black' | 'draw') => void;
  /** Lock the board so player can't move (e.g. AI thinking) */
  locked?: boolean;
  /** Which color the human plays */
  playerColor?: 'w' | 'b';
  /** Track last move for highlight */
  lastMove?: { from: string; to: string } | null;
}

export function ChessBoard({ game, onMove, onGameEnd, locked, playerColor = 'w', lastMove }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [, setTick] = useState(0);

  const handleSquarePress = useCallback((square: Square) => {
    if (game.isGameOver() || locked) return;
    // Only allow moving own pieces
    if (playerColor && game.turn() !== playerColor) return;

    if (selectedSquare) {
      try {
        const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
          setTick(c => c + 1);
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
      } catch { /* invalid */ }
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
  }, [game, selectedSquare, onGameEnd, onMove, locked, playerColor]);

  return (
    <View style={styles.boardWrapper}>
      {/* Top file labels */}
      <View style={styles.fileRow}>
        <View style={{ width: 18 }} />
        {FILES.map(f => (
          <Text key={`t${f}`} style={[styles.coordLabel, { width: SQ }]}>{f}</Text>
        ))}
        <View style={{ width: 18 }} />
      </View>

      {/* Board rows */}
      {RANKS.map((rank, ri) => (
        <View key={rank} style={styles.row}>
          <Text style={[styles.coordLabel, styles.rankLabel]}>{rank}</Text>
          {FILES.map((file, fi) => {
            const square = `${file}${rank}` as Square;
            const isLight = (ri + fi) % 2 === 0;
            const piece = game.get(square);
            const isSelected = selectedSquare === square;
            const isLegal = legalMoves.includes(square);
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

            return (
              <TouchableOpacity
                key={square}
                style={[
                  { width: SQ, height: SQ },
                  styles.square,
                  isLight ? styles.lightSquare : styles.darkSquare,
                  isLastMove && styles.lastMoveSquare,
                  isSelected && styles.selectedSquare,
                ]}
                onPress={() => handleSquarePress(square)}
                activeOpacity={0.7}
              >
                {piece && (
                  <Text style={[styles.piece, { fontSize: SQ * 0.7, lineHeight: SQ * 0.85 }]}>
                    {PIECE_UNICODE[piece.color][piece.type]}
                  </Text>
                )}
                {isLegal && !piece && <View style={styles.legalDot} />}
                {isLegal && piece && <View style={styles.legalCapture} />}
              </TouchableOpacity>
            );
          })}
          <Text style={[styles.coordLabel, styles.rankLabel]}>{rank}</Text>
        </View>
      ))}

      {/* Bottom file labels */}
      <View style={styles.fileRow}>
        <View style={{ width: 18 }} />
        {FILES.map(f => (
          <Text key={`b${f}`} style={[styles.coordLabel, { width: SQ }]}>{f}</Text>
        ))}
        <View style={{ width: 18 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrapper: {
    borderWidth: 2,
    borderColor: G.gold,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#3B2507',
  },
  fileRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankLabel: {
    width: 18,
  },
  coordLabel: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    paddingVertical: 1,
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightSquare: {
    backgroundColor: '#EDD6B0',
  },
  darkSquare: {
    backgroundColor: '#B88762',
  },
  selectedSquare: {
    backgroundColor: G.gold,
  },
  lastMoveSquare: {
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
  },
  legalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  legalCapture: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 99,
  },
  piece: {
    textAlign: 'center',
  },
});
