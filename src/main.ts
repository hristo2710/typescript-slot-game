import './style.css';
import { Application, Graphics, Text } from 'pixi.js';
import { createActor } from 'xstate';
import {
  Subject,
  filter,
  throttleTime,
  debounceTime,
  takeUntil,
} from 'rxjs';

import { Reel } from './Reel';
import { gameMachine } from './gameMachine';
import { gameEvents$ } from './gameEvents';
import 'reflect-metadata';
import { container, GameService } from './container';

async function initGame(): Promise<void> {
  const gameService = container.resolve(GameService);
  // Initialize XState
  const gameActor = createActor(gameMachine);
  gameActor.start();

  // Used to stop RxJS subscriptions
  const destroy$ = new Subject<void>();

  // Initialize PixiJS
  const app = new Application();

  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1a1a2e,
  });

  document.querySelector<HTMLDivElement>('#app')!
    .appendChild(app.canvas);

  // Background behind reels
  const reelsBackground = new Graphics()
    .roundRect(100, 120, 600, 300, 15)
    .fill(0x292947);

  app.stage.addChild(reelsBackground);

  // Game title
  const title = new Text({
    text: 'SLOT GAME',
    style: {
      fontSize: 40,
      fill: 0xffffff,
      fontWeight: 'bold',
    },
  });

  title.anchor.set(0.5);
  title.position.set(400, 60);
  app.stage.addChild(title);

  // Create five reels
  const reels: Reel[] = [];

  for (let i = 0; i < 5; i++) {
    const reel = new Reel();

    reel.position.set(120 + i * 115, 135);

    reels.push(reel);
    app.stage.addChild(reel);
  }

  // Balance and bet
  let balance = 100;
  let bet = 10;

  // The bet currently selected by the player.
  // Updated immediately when BET +/- is clicked.
  let selectedBet = bet;

  const minBet = 5;
  const maxBet = 50;
  const betStep = 5;

  const balanceText = new Text({
    text: `Balance: ${balance} | Bet: ${bet}`,
    style: {
      fontSize: 22,
      fill: 0xffffff,
    },
  });

  balanceText.anchor.set(0.5);
  balanceText.position.set(400, 445);
  app.stage.addChild(balanceText);

  // Result message
  const resultText = new Text({
    text: '',
    style: {
      fontSize: 24,
      fill: 0xffd700,
      fontWeight: 'bold',
    },
  });

  resultText.anchor.set(0.5);
  resultText.position.set(400, 570);
  app.stage.addChild(resultText);

  // SPIN button
  const spinButton = new Graphics()
    .roundRect(0, 0, 180, 60, 12)
    .fill(0xe94560);

  spinButton.position.set(310, 475);
  spinButton.eventMode = 'static';
  spinButton.cursor = 'pointer';

  const spinText = new Text({
    text: 'SPIN',
    style: {
      fontSize: 28,
      fill: 0xffffff,
      fontWeight: 'bold',
    },
  });

  spinText.anchor.set(0.5);
  spinText.position.set(90, 30);

  spinButton.addChild(spinText);
  app.stage.addChild(spinButton);

  // Helper for creating bet buttons
  function createBetButton(
    label: string,
    x: number
  ): Graphics {
    const button = new Graphics()
      .roundRect(0, 0, 65, 50, 10)
      .fill(0x393957);

    button.position.set(x, 480);
    button.eventMode = 'static';
    button.cursor = 'pointer';

    const text = new Text({
      text: label,
      style: {
        fontSize: 28,
        fill: 0xffffff,
        fontWeight: 'bold',
      },
    });

    text.anchor.set(0.5);
    text.position.set(32.5, 25);

    button.addChild(text);
    app.stage.addChild(button);

    return button;
  }

  const betMinusButton = createBetButton('−', 210);
  const betPlusButton = createBetButton('+', 525);

  // Observable for bet changes
  const betChanges$ = new Subject<number>();

  // Debounce bet updates
  betChanges$
    .pipe(
      debounceTime(400),
      takeUntil(destroy$)
    )
    .subscribe(newBet => {
      if (!gameActor.getSnapshot().matches('idle')) {
        return;
      }

      bet = newBet;

      balanceText.text =
        `Balance: ${balance} | Bet: ${bet}`;

      console.log('RxJS: Bet updated:', bet);
    });

  // BET - button
  betMinusButton.on('pointerdown', () => {
    if (!gameActor.getSnapshot().matches('idle')) {
      return;
    }

    selectedBet = Math.max(
      minBet,
      selectedBet - betStep
    );

    betChanges$.next(selectedBet);
  });

  // BET + button
  betPlusButton.on('pointerdown', () => {
    if (!gameActor.getSnapshot().matches('idle')) {
      return;
    }

    selectedBet = Math.min(
      maxBet,
      selectedBet + betStep
    );

    betChanges$.next(selectedBet);
  });

  // SPIN button emits an RxJS event
  spinButton.on('pointerdown', () => {
    gameEvents$.next({ type: 'SPIN_CLICKED' });
  });

  // Handle SPIN events
  gameEvents$
    .pipe(
      filter(event => event.type === 'SPIN_CLICKED'),
      throttleTime(500),
      takeUntil(destroy$)
    )
    .subscribe(async () => {
      // Only allow spinning in idle state
      if (!gameActor.getSnapshot().matches('idle')) {
        return;
      }

      // Apply the latest selected bet before spinning
      bet = selectedBet;

      // Check balance
      if (balance < bet) {
        resultText.text = 'Not enough credits!';
        return;
      }

      gameActor.send({ type: 'SPIN' });

      // Deduct bet
      balance -= bet;

      balanceText.text =
        `Balance: ${balance} | Bet: ${bet}`;

      resultText.text = '';
      spinButton.alpha = 0.5;

      // Generate result before animation
      const result = gameService.spin();

      console.log('Generated result:', result);
      console.table(result);

      // Animate all reels
      await Promise.all(
        reels.map((reel, index) =>
          reel.spin(result[index], index * 0.4)
        )
      );

      // Verify displayed symbols
      console.log('Expected:', result);
      console.log(
        'Displayed:',
        reels.map(reel => reel.getVisibleSymbols())
      );

      // Calculate winnings
      const gameResult = gameService.calculateResult(result, bet);

      balance += gameResult.payout;

      balanceText.text =
        `Balance: ${balance} | Bet: ${bet}`;

      gameActor.send({ type: 'STOP' });

      resultText.text = gameResult.isWin
        ? `YOU WIN ${gameResult.payout} CREDITS!`
        : 'TRY AGAIN!';

      // Emit completed spin event
      gameEvents$.next({
        type: 'SPIN_FINISHED',
        payout: gameResult.payout,
      });

      gameActor.send({ type: 'CONTINUE' });

      spinButton.alpha = 1;
    });

  // React to completed spins
  gameEvents$
    .pipe(
      filter(event => event.type === 'SPIN_FINISHED'),
      takeUntil(destroy$) // takeUntil means the subscription will automatically unsubscribe when destroy$ emits, preventing memory leaks.
    )
    .subscribe(event => {
      console.log(
        'RxJS: Spin finished. Payout:',
        event.payout
      );
    });

  // Cleanup function
  function cleanup(): void {
    destroy$.next();
    destroy$.complete();

    betChanges$.complete();

    gameActor.stop();
    app.destroy(true);
  }

  // Expose cleanup for development testing
  // Call cleanup() when the game is removed.
  void cleanup;
}

initGame();
