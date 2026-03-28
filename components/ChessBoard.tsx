import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Chess, Square, PieceSymbol } from 'chess.js';

const G = Colors.gaming;

const PIECE_UNICODE: Record<string, Record<PieceSymbol, string>> = {
  w: { p: '\u2659', r: '\u2656', n: '\u2658', b: '\u2657', q: '\u2655', k: '\u2654' },
  b: { p: '\u265F', r: '\u265C', n: '\u265E', b: '\u265D', q: '\u265B', k: '\u265A' },
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

interface ChessBoardProps {
  onGameEnd?: (result: 'white' | 'black' | 'draw') => void;
  onMove?: () => void;
  game?: Chess;
}

export function ChessBoard({ onGameEnd, onMove, game: externalGame }: ChessBoardProps) {
  const [internalGame] = useState(() => new Chess());
  const game = externalGame || internalGame;
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [, setMoveCount] = useState(0);

  const handleSquarePress = useCallback((square: Square) => {
    if (game.isGameOver()) return;

    if (selectedSquare) {
      try {
        const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
          setMoveCount(c => c + 1);
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
      } catch { /* invalid move */ }
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
  }, [game, selectedSquare, onGameEnd, onMove]);

  const handleResign = () => {
    Alert.alert('Abandonner', 'Voulez-vous vraiment abandonner ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: () => onGameEnd?.(game.turn() === 'w' ? 'black' : 'white') },
    ]);
  };

  const handleDrawOffer = () => {
    Alert.alert('Nulle', 'Proposition de nulle acceptée (simulation).', [
      { text: 'OK', onPress: () => onGameEnd?.('draw') },
    ]);
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
                  {piece && <Text style={styles.piece}>{PIECE_UNICODE[piece.color][piece.type]}</Text>}
                  {isLegal && !piece && <View style={styles.legalDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={styles.fileLabels}>
          <View style={{ width: 16 }} />
          {FILES.map(f => <Text key={f} style={styles.fileLabel}>{f}</Text>)}
        </View>
      </View>

      <View style={styles.controls}>
        {!isOver ? (
          <>
            <TouchableOpacity style={styles.resignButton} onPress={handleResign}>
              <Text style={styles.buttonText}>Abandonner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawButton} onPress={handleDrawOffer}>
              <Text style={styles.buttonText}>Proposer nulle</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.goldButton} onPress={() => {
            game.reset();
            setSelectedSquare(null);
            setLegalMoves([]);
            setMoveCount(0);
          }}>
            <Text style={styles.goldButtonText}>Nouvelle partie</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const SQ = 36;

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  status: { fontSize: 14, fontWeight: '700', color: G.gold, marginBottom: 8, textAlign: 'center' },
  board: { borderWidth: 2, borderColor: G.borderGold, borderRadius: 4, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rankLabel: { width: 16, textAlign: 'center', fontSize: 10, color: G.textMuted, fontWeight: '600' },
  fileLabels: { flexDirection: 'row' },
  fileLabel: { width: SQ, textAlign: 'center', fontSize: 10, color: G.textMuted, fontWeight: '600', paddingTop: 2 },
  square: { width: SQ, height: SQ, alignItems: 'center', justifyContent: 'center' },
  lightSquare: { backgroundColor: '#B8A07E' },
  darkSquare: { backgroundColor: '#6B4E2F' },
  selectedSquare: { backgroundColor: G.gold, opacity: 0.85 },
  legalSquare: { backgroundColor: 'rgba(212, 175, 55, 0.35)' },
  piece: { fontSize: 26, lineHeight: 32 },
  legalDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(212,175,55,0.5)' },
  controls: { flexDirection: 'row', gap: 10, marginTop: 10 },
  resignButton: { backgroundColor: G.red, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  drawButton: { backgroundColor: G.textMuted, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  goldButton: { backgroundColor: G.gold, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  goldButtonText: { color: G.bg, fontWeight: '800', fontSize: 12 },
});
