import { Chess, Move, Square } from 'chess.js';
import { stockfishEngine } from './stockfishEngine';

export type Level = 'beginner' | 'intermediate' | 'expert';

// ── Piece values ──
const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
};

// ── Piece-Square Tables (from white's perspective) ──
const PST: Record<string, number[]> = {
  p: [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0,
  ],
  n: [
   -50,-40,-30,-30,-30,-30,-40,-50,
   -40,-20,  0,  0,  0,  0,-20,-40,
   -30,  0, 10, 15, 15, 10,  0,-30,
   -30,  5, 15, 20, 20, 15,  5,-30,
   -30,  0, 15, 20, 20, 15,  0,-30,
   -30,  5, 10, 15, 15, 10,  5,-30,
   -40,-20,  0,  5,  5,  0,-20,-40,
   -50,-40,-30,-30,-30,-30,-40,-50,
  ],
  b: [
   -20,-10,-10,-10,-10,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0, 10, 10, 10, 10,  0,-10,
   -10,  5,  5, 10, 10,  5,  5,-10,
   -10,  0, 10, 10, 10, 10,  0,-10,
   -10, 10, 10, 10, 10, 10, 10,-10,
   -10,  5,  0,  0,  0,  0,  5,-10,
   -20,-10,-10,-10,-10,-10,-10,-20,
  ],
  r: [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0,
  ],
  q: [
   -20,-10,-10, -5, -5,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
     0,  0,  5,  5,  5,  5,  0, -5,
   -10,  5,  5,  5,  5,  5,  0,-10,
   -10,  0,  5,  0,  0,  0,  0,-10,
   -20,-10,-10, -5, -5,-10,-10,-20,
  ],
  k: [
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -20,-30,-30,-40,-40,-30,-30,-20,
   -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20,
  ],
};

function getPSTValue(type: string, color: string, row: number, col: number): number {
  const table = PST[type];
  if (!table) return 0;
  const idx = color === 'w' ? row * 8 + col : (7 - row) * 8 + col;
  return table[idx] || 0;
}

function evaluateBoard(game: Chess): number {
  const board = game.board();
  let score = 0;

  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw()) return 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] + getPSTValue(piece.type, piece.color, r, c);
      score += piece.color === 'w' ? value : -value;
    }
  }

  // Mobility bonus
  const currentMoves = game.moves().length;
  score += game.turn() === 'w' ? currentMoves * 2 : -currentMoves * 2;

  return score;
}

function orderMoves(game: Chess, moves: string[]): string[] {
  const scored = moves.map(move => {
    let score = 0;
    const m = game.move(move);
    if (m) {
      if (m.captured) score += PIECE_VALUES[m.captured] * 10 - PIECE_VALUES[m.piece];
      if (m.san.includes('+')) score += 50;
      if (m.san.includes('#')) score += 10000;
      if (m.promotion) score += PIECE_VALUES[m.promotion] || 800;
      game.undo();
    }
    return { move, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.move);
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = orderMoves(game, game.moves());

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const val = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const val = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// ── Sync fallback (minimax) ──
export function getAIMove(game: Chess, level: Level): string | null {
  const moves = game.moves({ verbose: true }) as Move[];
  if (moves.length === 0) return null;

  if (level === 'beginner') {
    // Weak: 50% random, 50% shallow eval
    if (Math.random() < 0.5) {
      return moves[Math.floor(Math.random() * moves.length)].san;
    }
    const scored = moves.map(m => {
      let s = Math.random() * 30;
      if (m.captured) s += PIECE_VALUES[m.captured] || 50;
      if (m.san.includes('+')) s += 20;
      return { move: m.san, score: s };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].move;
  }

  const depth = level === 'intermediate' ? 3 : 4;
  const noise = level === 'intermediate' ? 30 : 5;
  const isMax = game.turn() === 'w';

  const scored = moves.map(m => {
    game.move(m.san);
    const val = minimax(game, depth, -Infinity, Infinity, !isMax) + (Math.random() - 0.5) * noise;
    game.undo();
    return { move: m.san, score: isMax ? val : -val };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
}

// ── Async Stockfish-powered move ──
let stockfishInitialized = false;
let stockfishAvailable = false;

export async function initAIEngine(): Promise<boolean> {
  if (stockfishInitialized) return stockfishAvailable;
  stockfishInitialized = true;
  stockfishAvailable = await stockfishEngine.init();
  return stockfishAvailable;
}

export function isStockfishReady(): boolean {
  return stockfishAvailable && stockfishEngine.isReady();
}

/**
 * Get AI move using Stockfish (async) with minimax fallback.
 * Returns the move in SAN notation.
 */
export async function getAIMoveAsync(game: Chess, level: Level): Promise<string | null> {
  const moves = game.moves({ verbose: true }) as Move[];
  if (moves.length === 0) return null;

  // Try Stockfish first
  if (stockfishAvailable && stockfishEngine.isReady()) {
    try {
      const uciMove = await stockfishEngine.getBestMove(game.fen(), level);
      if (uciMove) {
        // Convert UCI move (e.g. "e2e4") to SAN by finding the matching legal move
        const from = uciMove.substring(0, 2) as Square;
        const to = uciMove.substring(2, 4) as Square;
        const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

        try {
          const move = game.move({ from, to, promotion: promotion as any });
          if (move) {
            const san = move.san;
            game.undo();
            return san;
          }
        } catch {
          // Invalid move from Stockfish, fall through to minimax
        }
      }
    } catch {
      // Stockfish error, fall through
    }
  }

  // Fallback to minimax
  return getAIMove(game, level);
}

export function destroyAIEngine() {
  stockfishEngine.destroy();
  stockfishInitialized = false;
  stockfishAvailable = false;
}
