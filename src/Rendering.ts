import { config } from "./config";

interface Listener {
  on(eventName: string, ...any: any[]): void;
}

type Board = {
  drawables: Drawable[],
  scores: number[];
}

type PlayerID = number;

export class DrawableBuffer {
  private drawables: Drawable[];
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private playerId: PlayerID;
  constructor(canvas: HTMLCanvasElement ,context: CanvasRenderingContext2D, listener: Listener, playerId: PlayerID) {
    this.drawables = [];
    this.canvas = canvas;
    this.context = context;
    this.playerId = playerId;
    listener.on("countDown", this.countDown.bind(this));
    listener.on("board", this.renewBoard.bind(this));
    listener.on("game over", this.gameOver.bind(this));
    listener.on("opponent left", this.opponentLeft.bind(this))
    this.waitForOpponent();
  }

  renewBoard(board: Board) {
    this.drawables = board.drawables;
    this.drawBoard(board, this.playerId === 1);
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
      this.canvas.height / 2 + config.countDownSize / 3);
  }

  private opponentLeft() {
    this.drawBackground();
    this.context.fillStyle = "#fff";
    this.context.font = `${30}px ${config.points.font.name}`;
    this.context.fillText(
      "Opponent left ;o",
      50,
    this.canvas.height / 2 - config.countDownSize);
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

  private drawBoard(board: Board, symmetricTransform: boolean) {
    this.drawBackground();
    this.context.fillStyle = "#fff";
    while(board.drawables.length > 0) {
      const drawable = this.drawables.pop()!;
      const transFormed = symmetricTransform ?
        pointSymmetricTransform(drawable, config.court.width, config.court.height) :
        drawable;
      this.context.fillRect(
        transFormed.x,
        transFormed.y,
        transFormed.w,
        transFormed.h
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
      this.canvas.height / 2 + config.centerLine.height / 2 +
        config.points.font.size
    );
    this.context.fillText(
      board.scores[1].toString(10),
      config.court.offset + config.line.height + config.points.offset.left,
      this.canvas.height / 2 -
        (config.centerLine.height / 2 + config.points.offset.centerLine)
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

  private gameOver(result: {scores: number[]}) {
    this.drawBackground();
    const resultMessage = result.scores[this.playerId] > result.scores[1-this.playerId] ? "YOU WIN" : "YOU LOSE";;
    this.context.fillStyle = "#fff";
    this.context.fillText(
      resultMessage,
      this.canvas.width / 2 - 90,
      this.canvas.height / 2 - 45
    );
    this.context.fillText(
      `${result.scores[0]} - ${result.scores[1]}`,
      this.canvas.width / 2 - 45,
      this.canvas.height / 2
    );
    this.context.fillText(
      `RELOAD`,
      this.canvas.width / 2  - 90,
      this.canvas.height / 2 + 45
    );
  }
}

type Drawable = Rect;

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
}

function pointSymmetricTransform(rect: Rect, maxX: number, maxY: number): Rect {
  return {
    x: maxX - rect.x - rect.w,
    y: maxY - rect.y - rect.h,
    w: rect.w,
    h: rect.h
  }
}