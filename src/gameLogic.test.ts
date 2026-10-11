import { calculateWin, generateResult } from './gameLogic';
import type { SymbolType } from './gameLogic';

// Unit tests for the slot game logic, specifically the calculateWin function.
describe('Slot Game Logic', () => {

  // Test case for a winning combination of three matching symbols.
  test('should return a win for three matching symbols', () => {
    const reels: SymbolType[][] = [
      ['🍒', '⭐', '🍋'],
      ['🔔', '⭐', '🍉'],
      ['🍋', '⭐', '🔔'],
      ['🍉', '🍒', '⭐'],
      ['⭐', '🍋', '🍒'],
    ];

    const result = calculateWin(reels, 10);

    expect(result.isWin).toBe(true);
    expect(result.payout).toBe(50);
  });

  // Test case for a non-winning combination of symbols.
  test('should return no win for different symbols', () => {
    const reels: SymbolType[][] = [
      ['🍒', '⭐', '🍋'],
      ['🔔', '🍒', '🍉'],
      ['🍋', '🔔', '⭐'],
      ['🍉', '🍒', '⭐'],
      ['⭐', '🍋', '🍒'],
    ];

    const result = calculateWin(reels, 10);

    expect(result.isWin).toBe(false);
    expect(result.payout).toBe(0);
  });

  // Test case to verify that the payout is correctly calculated based on the bet amount.
  test('should calculate payout based on bet', () => {
    const reels: SymbolType[][] = [
      ['🍒', '⭐', '🍋'],
      ['🔔', '⭐', '🍉'],
      ['🍋', '⭐', '🔔'],
      ['🍉', '🍒', '⭐'],
      ['⭐', '🍋', '🍒'],
    ];

    const result = calculateWin(reels, 20);

    expect(result.payout).toBe(100);
  });

  // Test case to verify that the generateResult function produces a predictable outcome when Math.random is mocked.
  test('should generate a predictable result using a mock', () => {
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValue(0);
  
    try {
      const result = generateResult();
  
      expect(result).toHaveLength(5);
  
      result.forEach((reel) => {
        expect(reel).toEqual(['🍒', '🍒', '🍒']);
      });
    } finally {
      randomSpy.mockRestore();
    }
  });

});
