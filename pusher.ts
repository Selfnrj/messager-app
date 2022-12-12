import Pusher from "pusher";
import ClientPusher from "pusher-js";


export const serverPusher = new Pusher({
  appId: "1523696",
  key: "2e3d1ce8d8cdfead1b2f",
  secret: "5dd603b92522f06eca93",
  cluster: "eu",
  useTLS: true,
});

export const clientPusher = new ClientPusher("2e3d1ce8d8cdfead1b2f", {
 cluster: "eu",
 forceTLS: true,
});