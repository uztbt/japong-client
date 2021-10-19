import { CommandBuffer } from './UserInput';
import { SocketIOTransmitter } from './SocketIOTransmitter'
import { config } from './config';
import { DrawableBuffer } from './Rendering';
import { io } from 'socket.io-client';
import './css/index.css';
import { RoomGrid } from './RoomGrid';

function main() {
  console.log("main() is called!");
  const socket = io(config.socketIOURL, config.socketIOOpts);
  // startPollingClusterStatus(config.clusterManagerURL);
  const grid1 = document.getElementById("grid-wrapper-1");
  const roomGrid1 = new RoomGrid(grid1!, "Asia", 5);
  socket.on('joinedRoom', (room: string, playerId: number) => {    
    if (playerId === 1) {
      commandBuffer.setMirror(true);
    }
    new DrawableBuffer(canvas, context, socket, playerId);
  });
  socket.once("countDown", () => {
    commandBuffer.addTransmitter(transmitter);  
  });
  
  const commandBuffer = new CommandBuffer();
  const transmitter = new SocketIOTransmitter(socket);
  
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
}

main();