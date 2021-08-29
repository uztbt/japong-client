import { config } from "./config";

interface Listener {
  on(eventName: string, ...any: any[]): void;
}

type Board = {
  drawables: Drawable[],
  scores: number[];
}

export class DrawableBuffer {
  private drawables: Drawable[];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement ,context: CanvasRenderingContext2D, listener: Listener) {
    this.drawables = [];
    this.canvas = canvas;
    this.context = context;
    listener.on("wait for opponent", this.waitForOpponent.bind(this));
    listener.on("countDown", this.countDown.bind(this));
    listener.on("board", this.renewBoard.bind(this));
  }

  renewBoard(board: Board) {
    console.log("renewBoard is called")
    console.profile(JSON.stringify(board));
    this.drawables = board.drawables;
    this.drawBoard(board);
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
    this.context.font = `${config.countDownSize}px ${config.points.font.name}`;
    this.context.fillText(
      seconds.toString(10),
      this.canvas.width / 2 - config.countDownSize / 3,
      this.canvas.height / 2 + config.countDownSize / 3)
  }

  private drawBoard(board: Board) {
    this.drawBackground();
    this.context.fillStyle = "#fff";
    while(board.drawables.length > 0) {
      const drawable = this.drawables.pop()!;
      this.context.fillRect(
        drawable.x,
        drawable.y,
        drawable.w,
        drawable.h
      );
    }
    const inCourtLength = this.canvas.width - 2 * (config.court.offset + config.line.height);
    for (let i = 0; i < inCourtLength / (2 * config.centerLine.width); i++) {
      this.context.fillRect(
        config.court.offset + config.line.height + (2 * i + 0.5) * config.centerLine.width,
        this.canvas.height / 2 - config.centerLine.height / 2,
        config.centerLine.width,
        config.centerLine.height
        );
    }
    this.context.font = `${config.points.font.size}px ${config.points.font.name}`;
    this.context.fillText(
      board.scores[0].toString(10),
      config.court.offset + config.line.height + config.points.offset.left,
      this.canvas.height / 2 -
        (config.centerLine.height / 2 + config.points.offset.centerLine)
    );
    this.context.fillText(
      board.scores[1].toString(10),
      config.court.offset + config.line.height + config.points.offset.left,
      this.canvas.height / 2 + config.centerLine.height / 2 +
        config.points.font.size
    );
  }

  private waitForOpponent() {
    this.drawBackground();
    this.context.fillStyle = "#fff";
    this.context.font = `${config.waitingSize}px Orbitron`;
    this.context.fillText(
      "Waiting for",
      50,
      this.canvas.height / 2 + 10 - config.countDownSize / 3);
    this.context.fillText(
      "your opponent",
      50,
      this.canvas.height / 2 + 10 + config.countDownSize / 3);
  }
}

type Drawable = Rect;

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
}
