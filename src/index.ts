import { CommandBuffer } from './UserInput';
import { SocketIOTransmitter } from './SocketIOTransmitter'
import { config } from './config';
import { DrawableBuffer } from './Rendering';
import { io } from 'socket.io-client';
import { Grid } from 'gridjs';
import './css/index.css';

function main() {
  console.log("main() is called!");
  const socket = io(config.socketIOURL, config.socketIOOpts);
  const grid1 = document.getElementById("grid-wrapper-1");
  new Grid({
    columns: ["Name", "Email", "Phone Number"],
    data: [
      ["John", "john@example.com", "(353) 01 222 3333"],
      ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
      ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
      ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
      ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
    ]
  }).render(grid1!);
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