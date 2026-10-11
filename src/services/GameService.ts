
import { inject, injectable } from 'tsyringe';

import { generateResult } from '../gameLogic';

import type {
  SymbolType,
  GameResult,
} from '../gameLogic';

import type { WinStrategy } from '../strategies/WinStrategy';

export interface IGameLogic {
  generateResult(): SymbolType[][];
  calculateWin(
    reels: SymbolType[][],
    bet: number
  ): GameResult;
}

@injectable()
export class GameLogic implements IGameLogic {
  constructor(
    @inject('WinStrategy')
    private readonly winStrategy: WinStrategy
  ) {}

  generateResult(): SymbolType[][] {
    return generateResult();
  }

  calculateWin(
    reels: SymbolType[][],
    bet: number
  ): GameResult {
    return this.winStrategy.calculateWin(reels, bet);
  }
}

@injectable()
export class GameService {
  constructor(
    @inject('GameLogic')
    private readonly gameLogic: IGameLogic
  ) {}

  public spin(): SymbolType[][] {
    return this.gameLogic.generateResult();
  }

  public calculateResult(
    reels: SymbolType[][],
    bet: number
  ): GameResult {
    return this.gameLogic.calculateWin(reels, bet);
  }
}
