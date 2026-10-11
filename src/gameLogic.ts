export type SymbolType = '🍒' | '🍋' | '🔔' | '🍉' | '⭐';

export type GameResult = {
  reels: SymbolType[][];
  isWin: boolean;
  payout: number;
};

const symbols: SymbolType[] = ['🍒', '🍋', '🔔', '🍉', '⭐'];

// Generates a random slot machine result with 5 reels and 3 symbols per reel.
export function generateResult(): SymbolType[][] {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 3 }, () => {
      const index = Math.floor(Math.random() * symbols.length);
      return symbols[index];
    })
  );
}

// Calculates the win based on the middle row of the slot machine result.
export function calculateWin(
  reels: SymbolType[][],
  bet: number
): GameResult {
  const middleRow = reels.map((reel) => reel[1]);

  const isWin =
    middleRow[0] === middleRow[1] &&
    middleRow[1] === middleRow[2];

  return {
    reels,
    isWin,
    payout: isWin ? bet * 5 : 0,
  };
}
