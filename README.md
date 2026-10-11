# TypeScript Slot Game

A browser-based slot game built with **TypeScript, PixiJS, GSAP, XState, RxJS, tsyringe, and Jest**.

This is a learning project created to explore game development concepts, animation, state management, reactive programming, dependency injection, design patterns, and unit testing.

## Features

- Five animated reels with three visible symbols each
- Randomly generated spin results
- Balance and bet management
- Adjustable bet using BET + and BET − buttons
- Win calculation using interchangeable strategies
- Game state management with XState
- Event handling with RxJS
- Dependency injection using tsyringe
- Reel animations using GSAP
- Unit tests using Jest

## Technologies

| Technology | Purpose |
|---|---|
| TypeScript | Type safety, interfaces, and application logic |
| Vite | Development server and production build |
| PixiJS | 2D rendering, reels, symbols, and interactive buttons |
| GSAP | Reel animations |
| XState | Managing the game lifecycle |
| RxJS | Handling game events and user interactions |
| tsyringe | Dependency injection |
| Jest | Unit testing |
| Git | Version control |

## Project Structure

```text
slot-game/
├── src/
│   ├── main.ts
│   ├── Reel.ts
│   ├── gameLogic.ts
│   ├── gameLogic.test.ts
│   ├── gameMachine.ts
│   ├── gameEvents.ts
│   ├── container.ts
│   ├── services/
│   │   ├── GameService.ts
│   │   └── GameService.test.ts
│   └── strategies/
│       ├── WinStrategy.ts
│       └── WinStrategy.test.ts
├── index.html
├── package.json
├── tsconfig.json
├── jest.config.cjs
└── README.md
```

## File Descriptions

### `src/main.ts` — Application Entry Point

The main file initializes and connects the different parts of the game.

Responsibilities:

- Initializes the PixiJS application and canvas
- Creates the game interface and five reels
- Manages the player's balance and selected bet
- Handles SPIN and BET button interactions
- Connects RxJS events to game actions
- Communicates with the XState machine
- Uses `GameService` to generate results and calculate winnings
- Updates the interface after each spin

It also defines a cleanup function for releasing application resources. In the current implementation, this function is prepared but is not automatically invoked.

### `src/Reel.ts` — Reel Rendering and Animation

Contains the `Reel` class, responsible for an individual slot reel.

Responsibilities:

- Creates the visual reel container
- Displays symbols using PixiJS
- Uses a mask to show three symbols at a time
- Animates spinning with GSAP
- Stops at the predetermined result
- Provides `getVisibleSymbols()` for verifying the displayed symbols

The result is generated before the animation begins. The animation then displays that result.

### `src/gameLogic.ts` — Core Game Logic

Contains the basic game types and functions.

**`SymbolType`**

Defines the allowed slot symbols.

**`GameResult`**

Describes a spin result, including the reels, win status, and payout.

**`generateResult()`**

Generates five reels containing three randomly selected symbols each.

**`calculateWin()`**

Contains the original standard win calculation logic.

The Strategy Pattern implementation provides an alternative way to calculate winnings through interchangeable strategy classes.

### `src/gameMachine.ts` — Game State Management

Defines the game state machine using XState.

The current state flow is:

```text
idle
  |
  | SPIN
  v
spinning
  |
  | STOP
  v
win
  |
  | CONTINUE
  v
idle
```

The state machine helps prevent a new spin from starting while another spin is in progress.

The `win` state currently represents the post-spin phase, even when the spin does not produce a winning combination.

### `src/gameEvents.ts` — RxJS Event Definitions

Defines the shared event stream using an RxJS `Subject`.

Supported events:

- `SPIN_CLICKED` — emitted when the player presses SPIN
- `SPIN_FINISHED` — emitted when a spin finishes, including the payout

The event stream allows different parts of the application to react to game events.

### `src/services/GameService.ts` — Game Service

Contains `GameService`, `GameLogic`, and the `IGameLogic` interface.

**`GameService`**

Provides methods for generating spin results and calculating payouts.

It receives its game logic dependency through constructor injection instead of creating it directly.

**`GameLogic`**

Implements the game logic interface and delegates win calculations to an injected strategy.

This separates the main game service from the specific payout algorithm.

### `src/strategies/WinStrategy.ts` — Strategy Pattern

Defines a common interface for different win calculation algorithms.

**`WinStrategy`**

The interface implemented by all win strategies.

**`StandardWinStrategy`**

- Requires the first three middle-row symbols to match
- Pays five times the bet

**`BonusWinStrategy`**

- Requires the first four middle-row symbols to match
- Pays ten times the bet

The strategies demonstrate how different algorithms can be used through the same interface.

Currently, `StandardWinStrategy` is registered as the active strategy. Automatic switching between standard and bonus modes has not been implemented.

### `src/container.ts` — Dependency Injection Container

Configures dependency injection using tsyringe.

It registers the implementations required by the application:

```text
GameService
    |
    v
GameLogic
    |
    v
WinStrategy
    |
    v
StandardWinStrategy
```

When the container resolves `GameService`, it creates the required dependencies.

This reduces coupling and makes implementations easier to replace or test.

### `src/gameLogic.test.ts` — Game Logic Tests

Tests the original win calculation logic, including:

- Winning combinations
- Losing combinations
- Payout calculation

### `src/services/GameService.test.ts` — Dependency Injection Test

Tests `GameService` using a mock implementation of `IGameLogic`.

This demonstrates how constructor injection allows the service to be tested without relying on the real game logic.

### `src/strategies/WinStrategy.test.ts` — Strategy Tests

Tests the different win calculation strategies.

The tests verify:

- Standard payouts for three matching symbols
- Bonus payouts for four matching symbols
- No bonus payout when only three symbols match

## How a Spin Works

1. The player presses the SPIN button.
2. RxJS emits a `SPIN_CLICKED` event.
3. The application checks whether the XState machine is in the `idle` state.
4. The selected bet is deducted from the balance.
5. `GameService` generates the spin result.
6. GSAP animates the five PixiJS reels.
7. The reels stop at the generated symbols.
8. The active win strategy calculates the payout.
9. The balance and result message are updated.
10. RxJS emits a `SPIN_FINISHED` event.
11. The state machine returns to `idle`.

## RxJS Operators

The project demonstrates several RxJS operators:

| Operator | Usage |
|---|---|
| `filter()` | Processes specific game events |
| `throttleTime()` | Limits rapid SPIN event handling |
| `debounceTime()` | Delays processing rapid bet changes |
| `takeUntil()` | Supports subscription cleanup |

## Design Patterns

### Dependency Injection

Dependencies are provided externally rather than created inside the classes that use them.

The project uses tsyringe to resolve the required game services and logic implementations.

### Strategy Pattern

Different win calculation algorithms implement the same interface.

The application can change the active strategy without changing the main game service.

### State Machine

XState defines valid game states and transitions, helping control the game lifecycle.

## Installation

**Requirements:** Node.js and npm.

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/typescript-slot-game.git
```

Navigate to the project:

```bash
cd typescript-slot-game
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Running Tests

```bash
npx jest --runInBand
```

## Production Build

```bash
npm run build
```

## Project Scope

This is a demonstration project, not a production-ready gambling application.

It uses simplified random result generation and payout rules. It does not implement certified randomness, regulated payout mathematics, real-money transactions, or a complete bonus game lifecycle.

The main goal is to demonstrate the use of modern TypeScript development tools and software architecture concepts in an interactive game.