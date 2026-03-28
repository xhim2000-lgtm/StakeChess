import { Chess, Move } from 'chess.js';

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 0,
};

// Bonus for central squares
const CENTER_BONUS: Record<string, number> = {
  d4: 30, d5: 30, e4: 30, e5: 30,
  c3: 10, c4: 15, c5: 15, c6: 10,
  d3: 15, d6: 15, e3: 15, e6: 15,
  f3: 10, f4: 15, f5: 15, f6: 10,
};

type Level = 'beginner' | 'intermediate' | 'expert';

function evaluateBoard(game: Chess): number {
  const board = game.board();
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const value = PIECE_VALUES[piece.type] || 0;
      const sq = piece.square;
      const center = CENTER_BONUS[sq] || 0;
      if (piece.color === 'w') {
        score += value + center;
      } else {
        score -= value + center;
      }
    }
  }

  return score;
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (depth === 0 || game.isGameOver()) {
    if (game.isCheckmate()) return maximizing ? -99999 : 99999;
    if (game.isDraw()) return 0;
    return evaluateBoard(game);
  }

  const moves = game.moves();

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

export function getAIMove(game: Chess, level: Level): string | null {
  const moves = game.moves({ verbose: true }) as Move[];
  if (moves.length === 0) return null;

  if (level === 'beginner') {
    // 60% random, 40% picks from top half
    if (Math.random() < 0.6) {
      return moves[Math.floor(Math.random() * moves.length)].san;
    }
    // Prefer captures and checks slightly
    const scored = moves.map(m => {
      let s = Math.random() * 50;
      if (m.captured) s += PIECE_VALUES[m.captured] || 50;
      if (m.san.includes('+')) s += 30;
      return { move: m.san, score: s };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].move;
  }

  if (level === 'intermediate') {
    // Depth 2 minimax with some randomness
    const isMax = game.turn() === 'w';
    const scored = moves.map(m => {
      game.move(m.san);
      const val = minimax(game, 2, -Infinity, Infinity, !isMax) + (Math.random() - 0.5) * 40;
      game.undo();
      return { move: m.san, score: isMax ? val : -val };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].move;
  }

  // Expert: deeper search, less randomness
  const isMax = game.turn() === 'w';
  const scored = moves.map(m => {
    game.move(m.san);
    const val = minimax(game, 3, -Infinity, Infinity, !isMax) + (Math.random() - 0.5) * 10;
    game.undo();
    return { move: m.san, score: isMax ? val : -val };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
}
