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
    console.log(`There are ${number} people in room ${room}`);
    const drawableBuffer = new DrawableBuffer(canvas, context, socket, number-1);
  })
  
  const transmitter = new SocketIOTransmitter(socket);
  const commandBuffer = new CommandBuffer();
  commandBuffer.addTransmitter(transmitter);
  
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
}

main();