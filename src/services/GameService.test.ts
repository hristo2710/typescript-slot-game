import 'reflect-metadata';
import { GameService } from './GameService';
import type { IGameLogic } from './GameService';
import type { SymbolType } from '../gameLogic';

// Tests for the GameService class, ensuring it correctly uses the injected game logic.
describe('GameService Dependency Injection', () => {
  test('uses the injected game logic', () => {
    const fakeResult: SymbolType[][] = [
      ['🍒', '🍒', '🍒'],
      ['🍋', '🍋', '🍋'],
      ['⭐', '⭐', '⭐'],
      ['🔔', '🔔', '🔔'],
      ['🍉', '🍉', '🍉'],
    ];

    const mockGameLogic: IGameLogic = {
      generateResult: jest.fn().mockReturnValue(fakeResult),
      calculateWin: jest.fn(),
    };

    const gameService = new GameService(mockGameLogic);

    const result = gameService.spin();

    expect(result).toEqual(fakeResult);
    // Ensure that the calculateWin method was not called during spin
    expect(mockGameLogic.generateResult).toHaveBeenCalledTimes(1);
  });
});