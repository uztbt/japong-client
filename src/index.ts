import { CommandBuffer } from './UserInput';
import { SocketIOTransmitter } from './SocketIOTransmitter'
import { config } from './config';

function main() {
  console.log("main() is called!");
  const transmitter = new SocketIOTransmitter(
    config.socketIOURL,
    config.socketIOOpts);
  if (typeof transmitter === "undefined") {
    throw Error("Failed to initialize transmitter");
  } else {
    console.log("transmitter is not undefined")
  }
  console.log(`transmitter: ${transmitter}`);
  const commandBuffer = new CommandBuffer(transmitter); 
}

main();