import { Subject } from 'rxjs';

// Defines the game events and the observable stream for the slot game.
export type GameEvent = { type: 'SPIN_CLICKED' } | { type: 'SPIN_FINISHED'; payout: number };

// Observable stream that emits game events for the slot game.
export const gameEvents$ = new Subject<GameEvent>();
