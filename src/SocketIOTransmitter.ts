import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { Transmitter } from './UserInput';

export class SocketIOTransmitter implements Transmitter {
  socket: Socket;
  constructor(url: string, opts: Partial<ManagerOptions & SocketOptions>) {
    this.socket = io(url, opts);
    if (typeof this.socket === "undefined") {
      throw Error("Failed to initialize transmitter");
    }
  }
  send(eventName: string, ...any: any[]) {
    this.socket.emit(eventName, ...any);
  }
}