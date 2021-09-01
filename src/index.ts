import { CommandBuffer } from './UserInput';
import { SocketIOTransmitter } from './SocketIOTransmitter'
import { config } from './config';
import { DrawableBuffer } from './Rendering';
import { io } from 'socket.io-client';
import './css/index.css';

function main() {
  console.log("main() is called!");
  const socket = io(config.socketIOURL, config.socketIOOpts);
  socket.on('joined room', (room: string, number: number) => {    
    const playerId = number - 1;
    if (playerId === 1) {
      commandBuffer.setMirror(true);
    }
    commandBuffer.addTransmitter(transmitter);  
    new DrawableBuffer(canvas, context, socket, playerId);
  });
  
  const commandBuffer = new CommandBuffer();
  const transmitter = new SocketIOTransmitter(socket);
  
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
}

main();