import { Socket } from 'socket.io-client';
import { Transmitter } from './UserInput';

export class SocketIOTransmitter implements Transmitter {
  socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }
  send(eventName: string, ...any: any[]) {
    this.socket.emit(eventName, ...any);
  }
}