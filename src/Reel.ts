
import { Container, Graphics, Text } from 'pixi.js';
import { gsap } from 'gsap';
import type { SymbolType } from './gameLogic';

// Represents a single reel in the slot machine. Handles symbol creation, spinning animation, and retrieving visible symbols.
export class Reel extends Container {
  private readonly availableSymbols: SymbolType[] = [
    '🍒', '🍋', '🔔', '🍉', '⭐'
  ];

  private readonly symbolHeight = 90;
  private readonly visibleRows = 3;
  private readonly reelWidth = 90;

  private readonly symbolsContainer = new Container();
  private readonly maskGraphics = new Graphics();

  constructor() {
    super();
    this.createReel();
  }

  private getRandomSymbol(): SymbolType {
    const index = Math.floor(
      Math.random() * this.availableSymbols.length
    );

    return this.availableSymbols[index];
  }

  // Creates the reel background, mask, and initial symbols.
  private createReel(): void {
    const background = new Graphics()
      .roundRect(
        0,
        0,
        this.reelWidth,
        this.visibleRows * this.symbolHeight,
        10
      )
      .fill(0x393957);

    this.addChild(background);

    this.maskGraphics
      .rect(
        0,
        0,
        this.reelWidth,
        this.visibleRows * this.symbolHeight
      )
      .fill(0xffffff);

    this.addChild(this.symbolsContainer);
    this.addChild(this.maskGraphics);

    this.symbolsContainer.mask = this.maskGraphics;

    // Initial visible symbols
    this.createSymbols([
      this.getRandomSymbol(),
      this.getRandomSymbol(),
      this.getRandomSymbol(),
    ]);
  }

  // Creates the symbols for the reel based on the provided array of symbols.
  private createSymbols(symbols: SymbolType[]): void {
    this.symbolsContainer.removeChildren().forEach(
      (child) => child.destroy()
    );

    symbols.forEach((symbol, index) => {
      const symbolText = new Text({
        text: symbol,
        style: {
          fontSize: 42,
          fill: 0xffffff,
        },
      });

      symbolText.anchor.set(0.5);

      symbolText.position.set(
        this.reelWidth / 2,
        index * this.symbolHeight + this.symbolHeight / 2
      );

      this.symbolsContainer.addChild(symbolText);
    });
  }

  // Spins the reel with a sequence of random symbols, ending with the specified final symbols.
  // The extraDuration parameter allows for adjusting the spin duration.
  public spin(
    finalSymbols: SymbolType[],
    extraDuration: number = 0
  ): Promise<void> {
    // Prepare a full sequence before animation.
    const totalSteps = 16 + Math.round(extraDuration * 10);

    const sequence: SymbolType[] = [];

    for (let i = 0; i < totalSteps; i++) {
      sequence.push(this.getRandomSymbol());
    }

    // The last three symbols are the predetermined result.
    sequence.unshift(...finalSymbols);

    this.createSymbols(sequence);

    // Start with the final three symbols below the visible area.
    const totalDistance = totalSteps * this.symbolHeight;

    this.symbolsContainer.y = -totalDistance;

    return new Promise((resolve) => {
      gsap.to(this.symbolsContainer, {
        y: 0,
        duration: 1.5 + extraDuration,
        ease: 'power2.out',
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  // Retrieves the symbols currently visible in the reel's viewport.
  public getVisibleSymbols(): string[] {
    return this.symbolsContainer.children
      .filter((child) => {
        const symbol = child as Text;
        const y = symbol.y + this.symbolsContainer.y;

        return y >= 0 &&
          y < this.visibleRows * this.symbolHeight;
      })
      .sort((a, b) => a.y - b.y)
      .map((child) => (child as Text).text);
  }
}
