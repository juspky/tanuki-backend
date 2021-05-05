import _ from "lodash";
import net from "net";
import { RegisterCallback } from "../Audio";

const server = net.createServer((socket) => {
  const audioFrequencyCallback = async (frequencies: number[]) => {
    const measuredLength = 18;
    const measuredOffset = 0;
    const measuredMax = _.max(
      frequencies.slice(measuredOffset, measuredOffset + measuredLength)
    );
    const multiplier = 1;
    const brightness = measuredMax * multiplier;
    sendCommand(socket, {
      id: 1,
      method: "set_bright",
      params: [
        brightness > 100 ? 100 : brightness <= 0 ? 1 : brightness,
        "sudden",
        30,
      ],
    });
  };

  RegisterCallback(audioFrequencyCallback);
});

export const StartYeelightMusicServer = (port?: number) => {
  server.listen(port || 8082, "0.0.0.0");
  console.log(
    `Yeelight Music Server listening at http://localhost:${port || 8082}`
  );
};

const sendCommand = (socket, data) => {
  const cmd = JSON.stringify(data);
  socket.write(cmd + "\r\n");
};
