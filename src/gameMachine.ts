
import { createMachine } from 'xstate';

// State machine for the slot game. Manages the states: idle, spinning, and win.
export const gameMachine = createMachine({
  id: 'slotGame',
  initial: 'idle',

  states: {
    idle: {
      on: {
        SPIN: 'spinning',
      },
    },

    spinning: {
      on: {
        STOP: 'win',
      },
    },

    win: {
      on: {
        CONTINUE: 'idle',
      },
    },
  },
});
