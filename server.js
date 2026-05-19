// Tiny PeerJS signaling broker — the "phone book" that helps two players'
// browsers find each other before the real game data flows directly between
// them via WebRTC. Game data never touches this server.

import { PeerServer } from "peer";

const PORT = process.env.PORT || 9000;
const PATH = "/";

const peerServer = PeerServer({
  port: PORT,
  path: PATH,
  allow_discovery: false,   // we don't expose a public list of connected peers
});

peerServer.on("connection", (client) => {
  console.log(`[connected]    ${client.getId()}`);
});

peerServer.on("disconnect", (client) => {
  console.log(`[disconnected] ${client.getId()}`);
});

peerServer.on("error", (error) => {
  console.error("[peer error]", error);
});

console.log(`PeerJS signaling server listening on port ${PORT}${PATH}`);
