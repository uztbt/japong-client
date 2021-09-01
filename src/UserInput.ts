import { config } from "./config";

enum Command {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  ENTER = "ENTER",
  MOVE = "MOVE"
}

type CommandDictionary = {
  [Command.UP]: boolean,
  [Command.DOWN]: boolean,
  [Command.LEFT]: boolean,
  [Command.RIGHT]: boolean,
  [Command.ENTER]: boolean,
  [Command.MOVE]: boolean
};

export interface Transmitter {
  send(eventName: string, any: any): void;
}

export class CommandBuffer {
  dict: CommandDictionary;
  transmitter: Transmitter | undefined;
  private mirror: boolean = false;
  intervalId: number | undefined;
  constructor() {
    this.dict = {
      [Command.UP]: false,
      [Command.DOWN]: false,
      [Command.LEFT]: false,
      [Command.RIGHT]: false,
      [Command.ENTER]: false,
      [Command.MOVE]: false
    };
    document.addEventListener("DOMContentLoaded", () => {
      document.addEventListener("keydown", this.registerKeyInput(true));
      document.addEventListener("keyup", this.registerKeyInput(false));
    });
  }

  addTransmitter(transmitter: Transmitter) {
    this.transmitter = transmitter;
    this.intervalId = window.setInterval(
      this.sendCommandDict.bind(this),
      config.sendCommandDictInterval);
  }

  setMirror(flag: boolean = true) {
    this.mirror = true;
  }

  private registerKeyInput(isKeyDown: boolean) {
    return (e: KeyboardEvent) => {
      let key : Command;
        switch (e.key) {
        case "ArrowUp":
            key = this.mirror ? Command.DOWN : Command.UP;
            this.dict[key] = isKeyDown;
            e.preventDefault();
            break;
        case "ArrowDown":
            key = this.mirror ? Command.UP : Command.DOWN;
            this.dict[key] = isKeyDown;
            e.preventDefault();
            break;
        case "ArrowLeft":
            key = this.mirror ? Command.RIGHT : Command.LEFT;
            this.dict[key] = isKeyDown;
            e.preventDefault();
            break;
        case "ArrowRight":
            key = this.mirror ? Command.LEFT : Command.RIGHT;
            this.dict[key] = isKeyDown;
            e.preventDefault();
            break;
        case "Enter":
            this.dict[Command.ENTER] = isKeyDown;
            e.preventDefault();
            break;
        }
    }
  }
  private sendCommandDict() {
    if (typeof this.transmitter === "undefined") {
      window.clearInterval(this.intervalId);
      throw Error("Failed to initialize transmitter");
    } else {
      this.transmitter.send("commandDict", this.dict);
    }
  }
}