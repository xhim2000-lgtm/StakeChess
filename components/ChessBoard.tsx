import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';

const PIECE_UNICODE: Record<string, Record<PieceSymbol, string>> = {
  w: { p: '\u2659', r: '\u2656', n: '\u2658', b: '\u2657', q: '\u2655', k: '\u2654' },
  b: { p: '\u265F', r: '\u265C', n: '\u265E', b: '\u265D', q: '\u265B', k: '\u265A' },
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

interface ChessBoardProps {
  onGameEnd?: (result: 'white' | 'black' | 'draw') => void;
}

export function ChessBoard({ onGameEnd }: ChessBoardProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [, setMoveCount] = useState(0); // force re-render

  const handleSquarePress = useCallback((square: Square) => {
    if (game.isGameOver()) return;

    if (selectedSquare) {
      // Try to make a move
      try {
        const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
          setMoveCount(c => c + 1);
          setSelectedSquare(null);
          setLegalMoves([]);

          if (game.isGameOver()) {
            let result: 'white' | 'black' | 'draw' = 'draw';
            if (game.isCheckmate()) {
              result = game.turn() === 'w' ? 'black' : 'white';
            }
            onGameEnd?.(result);
          }
          return;
        }
      } catch {
        // Invalid move, try selecting new piece
      }
    }

    // Select a piece
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to as Square));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [game, selectedSquare, onGameEnd]);

  const handleResign = () => {
    Alert.alert('Abandonner', 'Voulez-vous vraiment abandonner ?', [
      { text: 'Non', style: 'cancel' },
      {
        text: 'Oui',
        style: 'destructive',
        onPress: () => {
          const winner = game.turn() === 'w' ? 'black' : 'white';
          onGameEnd?.(winner);
        },
      },
    ]);
  };

  const handleDrawOffer = () => {
    Alert.alert('Nulle', 'Proposition de nulle acceptée (simulation).', [
      { text: 'OK', onPress: () => onGameEnd?.('draw') },
    ]);
  };

  const handleReset = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveCount(0);
  };

  const turn = game.turn();
  const inCheck = game.inCheck();
  const isOver = game.isGameOver();

  let statusText = turn === 'w' ? 'Trait aux Blancs' : 'Trait aux Noirs';
  if (inCheck && !isOver) statusText += ' (Échec)';
  if (game.isCheckmate()) statusText = (turn === 'w' ? 'Noirs' : 'Blancs') + ' gagnent par mat !';
  if (game.isDraw()) statusText = 'Partie nulle';
  if (game.isStalemate()) statusText = 'Pat - Partie nulle';

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{statusText}</Text>

      <View style={styles.board}>
        {RANKS.map((rank, ri) => (
          <View key={rank} style={styles.row}>
            <Text style={styles.rankLabel}>{rank}</Text>
            {FILES.map((file, fi) => {
              const square = `${file}${rank}` as Square;
              const isLight = (ri + fi) % 2 === 0;
              const piece = game.get(square);
              const isSelected = selectedSquare === square;
              const isLegal = legalMoves.includes(square);

              return (
                <TouchableOpacity
                  key={square}
                  style={[
                    styles.square,
                    isLight ? styles.lightSquare : styles.darkSquare,
                    isSelected && styles.selectedSquare,
                    isLegal && styles.legalSquare,
                  ]}
                  onPress={() => handleSquarePress(square)}
                  activeOpacity={0.7}
                >
                  {piece && (
                    <Text style={styles.piece}>
                      {PIECE_UNICODE[piece.color][piece.type]}
                    </Text>
                  )}
                  {isLegal && !piece && <View style={styles.legalDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={styles.fileLabels}>
          <View style={{ width: 18 }} />
          {FILES.map(f => (
            <Text key={f} style={styles.fileLabel}>{f}</Text>
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        {!isOver ? (
          <>
            <TouchableOpacity style={styles.resignButton} onPress={handleResign}>
              <Text style={styles.resignText}>Abandonner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawButton} onPress={handleDrawOffer}>
              <Text style={styles.drawText}>Proposer nulle</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Nouvelle partie</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const SQUARE_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankLabel: {
    width: 18,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  fileLabels: {
    flexDirection: 'row',
  },
  fileLabel: {
    width: SQUARE_SIZE,
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    paddingTop: 2,
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightSquare: {
    backgroundColor: '#F0D9B5',
  },
  darkSquare: {
    backgroundColor: '#B58863',
  },
  selectedSquare: {
    backgroundColor: '#FFFF00',
    opacity: 0.8,
  },
  legalSquare: {
    backgroundColor: 'rgba(0, 200, 0, 0.3)',
  },
  piece: {
    fontSize: 30,
    lineHeight: 36,
  },
  legalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  resignButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resignText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  drawButton: {
    backgroundColor: Colors.textSecondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  drawText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
