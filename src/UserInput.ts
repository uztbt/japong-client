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

  private registerKeyInput(isKeyDown: boolean) {
    return (e: KeyboardEvent) => {
        e.preventDefault();
        switch (e.key) {
        case "ArrowUp":
            this.dict[Command.UP] = isKeyDown;
            break;
        case "ArrowDown":
            this.dict[Command.DOWN] = isKeyDown;
            break;
        case "ArrowLeft":
            this.dict[Command.LEFT] = isKeyDown;
            break;
        case "ArrowRight":
            this.dict[Command.RIGHT] = isKeyDown;
            break;
        case "Enter":
            this.dict[Command.ENTER] = isKeyDown;
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