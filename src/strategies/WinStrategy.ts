import type { GameResult, SymbolType } from '../gameLogic';

// Common interface for all win strategies
export interface WinStrategy {
  calculateWin(
    reels: SymbolType[][],
    bet: number
  ): GameResult;
}

// Standard game: first 3 middle symbols must match
export class StandardWinStrategy implements WinStrategy {
  calculateWin(
    reels: SymbolType[][],
    bet: number
  ): GameResult {
    const middleRow = reels.map(reel => reel[1]);

    const isWin =
      middleRow[0] === middleRow[1] &&
      middleRow[1] === middleRow[2];

    return {
      reels,
      isWin,
      payout: isWin ? bet * 5 : 0,
    };
  }
}

// Bonus game: first 4 middle symbols must match
export class BonusWinStrategy implements WinStrategy {
  calculateWin(
    reels: SymbolType[][],
    bet: number
  ): GameResult {
    const middleRow = reels.map(reel => reel[1]);

    const isWin =
      middleRow[0] === middleRow[1] &&
      middleRow[1] === middleRow[2] &&
      middleRow[2] === middleRow[3];

    return {
      reels,
      isWin,
      payout: isWin ? bet * 10 : 0,
    };
  }
}
