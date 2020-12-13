import { Lookup } from "node-yeelight-wifi";
import { Yeelight } from "../Sequelize";

const YeeLights = [];

// TODO: Disconnect does not work needs to be fixed in https://github.com/Bastl34/node-yeelight-wifi
const InitYeelight = () => {
  let look = new Lookup();

  look.on("detected", async (light) => {
    YeeLights.push(light);

    const [DBLight] = await Yeelight.upsert({
      id: light.id,
      power: light.power,
      type: light.type,
      connected: true,
      brightness: light.bright,
      rgbR: light.rgb.r,
      rgbG: light.rgb.g,
      rgbB: light.rgb.b,
      hsbH: light.hsb.h,
      hsbS: light.hsb.s,
      hsbB: light.hsb.b,
    });

    //socket connect and disconnect events
    light.on("connected", async () => {
      DBLight.connected = true;
      await DBLight.save();
    });
    light.on("disconnected", async () => {
      DBLight.connected = false;
      await DBLight.save();
    });

    //if the color or power state has changed
    light.on("stateUpdate", async (light) => {
      Object.assign(DBLight, {
        ...DBLight,
        power: light.power,
        type: light.type,
        connected: true,
        brightness: light.bright,
        rgbR: light.rgb.r,
        rgbG: light.rgb.g,
        rgbB: light.rgb.b,
        hsbH: light.hsb.h,
        hsbS: light.hsb.s,
        hsbB: light.hsb.b,
      });
      await DBLight.save();
    });

    //if something went wrong
    light.on("failed", (error) => {
      console.log(error);
    });
  });
};

export default YeeLights;
export { InitYeelight };
