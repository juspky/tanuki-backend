import { EventEmitter } from "events";
import { Socket } from "net";

type device = {
  host: string;
  port: number;
  debug?: boolean;
  tracked_attrs?: string[];
  interval?: number;
};

class YeeDevice extends EventEmitter {
  pollingInterval: number;
  connected: boolean;
  forceDisconnect: boolean;
  device: device;
  debug: boolean;
  timer: NodeJS.Timeout;
  retry_timer: NodeJS.Timeout;
  tracked_attrs: string[];
  socket: Socket;

  constructor(device: device) {
    super();
    this.device = device;
    this.debug = this.device.debug || false;
    this.connected = false;
    this.forceDisconnect = false;
    this.timer = null;
    this.tracked_attrs = this.device.tracked_attrs || [
      "power",
      "bright",
      "rgb",
      "flowing",
      "flow_params",
      "hue",
      "sat",
      "ct",
    ];
    this.pollingInterval = this.device.interval || 5000;
    this.retry_timer = null;
  }

  connect() {
    try {
      this.forceDisconnect = false;
      this.socket = new Socket();
      this.bindSocket();
      this.socket.connect(
        { host: this.device.host, port: this.device.port },
        () => {
          this.didConnect();
          this.emit("connected");
        }
      );
    } catch (err) {
      this.socketClosed(err);
    }
  }

  disconnect(forceDisconnect = true) {
    this.forceDisconnect = forceDisconnect;
    this.connected = false;
    clearInterval(this.timer);
    this.socket.destroy();
    this.socket = null;
    this.emit("disconnected");
    if (this.forceDisconnect && this.retry_timer)
      clearTimeout(this.retry_timer);
  }

  bindSocket() {
    this.socket.on("data", (data) => {
      this.didReceiveResponse(data);
    });

    this.socket.on("error", (err) => {
      this.emit("socketError", err);
      this.socketClosed(err);
    });

    this.socket.on("end", () => {
      this.emit("socketEnd");
      this.socketClosed();
    });
  }

  socketClosed(err?) {
    if (this.forceDisconnect) return;

    if (err && this.debug) {
      console.log("Socket Closed :", err);
      console.log("Reconnecting in 5 secs");
    }
    this.disconnect(false);
    if (this.retry_timer) {
      clearTimeout(this.retry_timer);
      this.retry_timer = null;
    }
    this.retry_timer = setTimeout(this.connect.bind(this), 5000);
  }

  didConnect() {
    this.connected = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timer = setInterval(
      this.sendHeartBeat.bind(this),
      this.pollingInterval
    );
  }

  sendHeartBeat() {
    this.sendCommand({
      id: 199,
      method: "get_prop",
      params: this.tracked_attrs,
    });
  }

  didReceiveResponse(data) {
    const dataArray = data.toString("utf8").split("\r\n");
    dataArray.forEach((dataString) => {
      if (dataString.length < 1) return;
      try {
        const response = JSON.parse(dataString);
        this.emit("deviceUpdate", response);
      } catch (err) {
        console.log(err, dataString);
      }
    });
  }

  sendCommand(data) {
    const cmd = JSON.stringify(data);
    if (this.connected && this.socket) {
      try {
        this.socket.write(cmd + "\r\n");
      } catch (err) {
        this.socketClosed(err);
      }
    }
  }

  setPower(power: boolean) {
    this.sendCommand({
      id: 1,
      method: "set_power",
      params: [power ? "on" : "off", "smooth", 300],
    });
  }

  setMusicMode(mode: "normal" | "music") {
    if (mode === "normal") {
      this.sendCommand({
        id: 1,
        method: "set_music",
        params: [0],
      });
      return;
    }
    if (mode === "music") {
      this.sendCommand({
        id: 1,
        method: "set_music",
        params: [
          1,
          "192.168.178.22",
          parseInt(process.env.YEELIGHT_MUSIC_SERVER_PORT) || 8082,
        ],
      });
    }
  }

  updateDevice(device) {
    this.device = device;
  }
}

export default YeeDevice;
