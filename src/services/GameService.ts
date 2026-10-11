import { inject, injectable } from 'tsyringe';

import {
  generateResult,
  calculateWin,
} from '../gameLogic';

import type {
  SymbolType,
  GameResult,
} from '../gameLogic';

export interface IGameLogic {
  generateResult(): SymbolType[][];
  calculateWin(
    reels: SymbolType[][],
    bet: number
  ): GameResult;
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

@injectable()
export class GameLogic implements IGameLogic {
  generateResult(): SymbolType[][] {
    return generateResult();
  }

  calculateWin(
    reels: SymbolType[][],
    bet: number
  ): GameResult {
    return calculateWin(reels, bet);
  }
}
