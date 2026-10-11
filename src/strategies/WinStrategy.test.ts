import {
  StandardWinStrategy,
  BonusWinStrategy,
} from './WinStrategy';

import type { SymbolType } from '../gameLogic';

describe('Win Strategies', () => {
  const winningReels: SymbolType[][] = [
    ['🍒', '⭐', '🍋'],
    ['🍋', '⭐', '🍒'],
    ['🔔', '⭐', '🍉'],
    ['🍉', '⭐', '🔔'],
    ['🍒', '🍋', '⭐'],
  ];

  const threeMatchingReels: SymbolType[][] = [
    ['🍒', '⭐', '🍋'],
    ['🍋', '⭐', '🍒'],
    ['🔔', '⭐', '🍉'],
    ['🍉', '🍒', '🔔'],
    ['🍒', '🍋', '⭐'],
  ];

  test('standard strategy pays for 3 matching symbols', () => {
    const strategy = new StandardWinStrategy();

    const result = strategy.calculateWin(
      threeMatchingReels,
      10
    );

    expect(result.isWin).toBe(true);
    expect(result.payout).toBe(50);
  });

  test('bonus strategy pays for 4 matching symbols', () => {
    const strategy = new BonusWinStrategy();

    const result = strategy.calculateWin(
      winningReels,
      10
    );

    expect(result.isWin).toBe(true);
    expect(result.payout).toBe(100);
  });

  test('bonus strategy does not pay for only 3 matches', () => {
    const strategy = new BonusWinStrategy();

    const result = strategy.calculateWin(
      threeMatchingReels,
      10
    );

    expect(result.isWin).toBe(false);
    expect(result.payout).toBe(0);
  });
});
