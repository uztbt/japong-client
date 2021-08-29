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
    listener.on("board", this.renew.bind(this));
  }
  renew(drawable: Drawable[]) {
    console.log(`renew called with ${drawable.length}`)
    this.drawables = drawable;
    this.draw();
  }
  private draw() {
    // Fill the background in Black
    this.context.fillStyle = "#000";
    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
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
