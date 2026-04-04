/**
 * Stockfish.js Web Worker integration for chess AI.
 * Uses UCI protocol to communicate with Stockfish engine.
 * Falls back gracefully when Web Workers are unavailable (React Native).
 */

type Level = 'beginner' | 'intermediate' | 'expert';

interface LevelConfig {
  depth: number;
  skill: number;
  moveTime: number;
}

const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  beginner:     { depth: 5,  skill: 3,  moveTime: 1000 },
  intermediate: { depth: 10, skill: 10, moveTime: 3000 },
  expert:       { depth: 15, skill: 20, moveTime: 5000 },
};

class StockfishEngine {
  private worker: Worker | null = null;
  private initialized = false;
  private resolveMove: ((move: string | null) => void) | null = null;
  private moveTimeout: ReturnType<typeof setTimeout> | null = null;

  async init(): Promise<boolean> {
    if (this.initialized && this.worker) return true;

    return new Promise((resolve) => {
      try {
        if (typeof Worker === 'undefined') {
          resolve(false);
          return;
        }

        // Load stockfish.js from the public directory (served as static asset)
        this.worker = new Worker('/stockfish.js');

        const timeout = setTimeout(() => {
          this.cleanup();
          resolve(false);
        }, 8000);

        this.worker.onmessage = (e: MessageEvent) => {
          const line = typeof e.data === 'string' ? e.data : String(e.data);

          if (line.includes('uciok')) {
            this.initialized = true;
            clearTimeout(timeout);
            // Send initial configuration
            this.worker!.postMessage('isready');
          }

          if (line.includes('readyok') && !this.initialized) {
            this.initialized = true;
            clearTimeout(timeout);
            resolve(true);
          }

          if (line.includes('readyok') && this.initialized) {
            resolve(true);
          }

          if (line.startsWith('bestmove')) {
            const parts = line.split(/\s+/);
            const move = parts[1];
            if (this.resolveMove) {
              this.resolveMove(move && move !== '(none)' ? move : null);
              this.resolveMove = null;
            }
            if (this.moveTimeout) {
              clearTimeout(this.moveTimeout);
              this.moveTimeout = null;
            }
          }
        };

        this.worker.onerror = () => {
          clearTimeout(timeout);
          this.cleanup();
          resolve(false);
        };

        this.worker.postMessage('uci');
      } catch {
        this.cleanup();
        resolve(false);
      }
    });
  }

  isReady(): boolean {
    return this.initialized && this.worker !== null;
  }

  /**
   * Get best move from Stockfish for a given FEN position and difficulty level.
   * Returns UCI move notation (e.g. "e2e4") or null on failure.
   */
  async getBestMove(fen: string, level: Level): Promise<string | null> {
    if (!this.worker || !this.initialized) return null;

    const config = LEVEL_CONFIG[level];

    return new Promise((resolve) => {
      this.resolveMove = resolve;

      // Configure engine strength
      this.worker!.postMessage(`setoption name Skill Level value ${config.skill}`);
      this.worker!.postMessage('ucinewgame');
      this.worker!.postMessage('isready');
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage(`go depth ${config.depth} movetime ${config.moveTime}`);

      // Safety timeout — resolve null if engine doesn't respond
      this.moveTimeout = setTimeout(() => {
        if (this.resolveMove) {
          this.resolveMove(null);
          this.resolveMove = null;
        }
      }, config.moveTime + 5000);
    });
  }

  private cleanup() {
    if (this.worker) {
      try {
        this.worker.postMessage('quit');
        this.worker.terminate();
      } catch { /* ignore */ }
      this.worker = null;
    }
    this.initialized = false;
  }

  destroy() {
    this.cleanup();
  }
}

// Singleton instance
export const stockfishEngine = new StockfishEngine();
