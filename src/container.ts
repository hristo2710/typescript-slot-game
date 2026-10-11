import { container } from 'tsyringe';

import {
  GameLogic,
  GameService,
} from './services/GameService';

container.register('GameLogic', {
  useClass: GameLogic,
});

export { container, GameService };
