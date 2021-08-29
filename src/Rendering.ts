import { config } from "./config";

interface Listener {
  on(eventName: string, ...any: any[]): void;
}

export class DrawableBuffer {
  private drawables: Drawable[];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement ,context: CanvasRenderingContext2D, listener: Listener) {
    this.drawables = [];
    this.canvas = canvas;
    this.context = context;
    listener.on("countDown", this.countDown.bind(this));
    listener.on("board", this.renewBoard.bind(this));
  }

  renewBoard(drawables: Drawable[]) {
    this.drawables = drawables;
    this.drawBoard();
  }

  private drawBackground() {
    // Fill the background in Black
    this.context.fillStyle = "#000";
    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  private countDown(seconds: number) {
    this.drawBackground();
    this.context.fillStyle = "#fff";
    this.context.font = `${config.countDownSize}px Orbitron`;
    this.context.fillText(
      seconds.toString(10),
      this.canvas.width / 2 - config.countDownSize / 3,
      this.canvas.height / 2 + config.countDownSize / 3)
  }

  private drawBoard() {
    this.drawBackground();
    this.context.fillStyle = "#fff";
    console.log(this.drawables.length)
    while(this.drawables.length > 0) {
      const drawable = this.drawables.pop()!;
      this.context.fillRect(
        drawable.x,
        drawable.y,
        drawable.w,
        drawable.h
      );
      console.log("Drawn!")
    }
  }
}

type Drawable = Rect;

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
}
