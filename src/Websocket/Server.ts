import WebSocket from "ws";

let wss: WebSocket.Server | undefined;

export const InitWebsocket = (port?: number) => {
  wss = new WebSocket.Server({
    port: port || 8081,
  });
  console.log(`WS listening at ws://localhost:${port ||8081}`);
};

export const Broadcast = (command: "audio_in_frequencies", data: {}) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ command, data }));
    }
  });
};
