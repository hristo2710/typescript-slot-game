import { container } from 'tsyringe';

import {
  GameLogic,
  GameService,
} from './services/GameService';

// Register the win strategy
import {
  StandardWinStrategy,
} from './strategies/WinStrategy';

// Register the standard win strategy
container.register('WinStrategy', {
  useClass: StandardWinStrategy,
});

// Register game logic
container.register('GameLogic', {
  useClass: GameLogic,
});

export { container, GameService };
