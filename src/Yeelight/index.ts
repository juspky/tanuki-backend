import { Discovery, Device } from "yeelight-platform";
import { Yeelight } from "../Sequelize";
import { YeelightInstance } from "../Sequelize/Models/Yeelight";
import { DiscoverResponse } from "./types";

const devices: { db: YeelightInstance; device: any }[] = [];

const addDevice = (yeelight: YeelightInstance) => {
  if (devices.some((d) => d.db.id === yeelight.id)) return;

  const device = new Device({ host: yeelight.host, port: yeelight.port });
  devices.push({ db: yeelight, device: device });
  device.connect();

  device.on("deviceUpdate", (newProps) => {
    console.log("update", newProps);
  });

  device.on("connected", async () => {
    yeelight.connected = true;
    await yeelight.save();
  });

  device.on("disconnected", async () => {
    yeelight.connected = false;
    await yeelight.save();
  });

  device.setPower = (power: boolean) => {
    device.sendCommand({
      id: 1,
      method: "set_power",
      params: [power ? "on" : "off", "smooth", 300],
    });
  };
};

const StartYeelightDiscoveryService = async () => {
  const discoveryService = new Discovery();

  discoveryService.on("started", () => {
    console.log("** YeeDiscovery Started **");
  });

  discoveryService.on("didDiscoverDevice", (device: DiscoverResponse) => {
    console.log("Discover", device);
    insertDiscoveredYeelight(device);
  });

  discoveryService.listen();
  const yeelights = await Yeelight.findAll();
  yeelights.forEach((y) => {
    addDevice(y);
  });
};

const insertDiscoveredYeelight = async (device: DiscoverResponse) => {
  const [yeelight] = await Yeelight.upsert({
    id: device.id,
    host: device.host,
    port: parseInt(device.port),
    type: device.model,
    brightness: parseInt(device.bright),
    rgb: parseInt(device.rgb),
    hue: parseInt(device.hue),
    sat: parseInt(device.sat),
    ct: parseInt(device.ct),
    power: device.power === "on" ? true : false,
  });

  addDevice(yeelight);
};

export { StartYeelightDiscoveryService, devices as YeeDevices };
