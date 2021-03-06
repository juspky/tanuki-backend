import express from "express";
import cors from "cors";
import SequelizeConn, { Yeelight } from "../Sequelize";
import { YeeDevices } from "../Services/Yeelight";

const InitAPI = (port?: number) => {
  const app = express();
  app.use(cors());
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.set("etag", false);

  const _port = port || 8080;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/devices", async (req, res) => {
    const yeelights = YeeDevices.map((y) => y.db);
    res.send({
      yeelights,
    });
  });

  app.get("/devices/yeelight/:id/power", async (req, res) => {
    const id = req.params.id;
    const power = req.query.state === "true" ? true : false;
    const light = YeeDevices.find((y) => y.db.id === id);
    light.device.setPower(power);

    res.sendStatus(200);
  });

  app.get("/devices/yeelight/:id/musicMode", async (req, res) => {
    const id = req.params.id;
    const state = req.query.state === "true" ? true : false;
    const light = YeeDevices.find((y) => y.db.id === id);
    light.device.setMusicMode(state ? "music" : "normal");

    res.sendStatus(200);
  });

  app.get("/devices/yeelight/:id/rgb", async (req, res) => {
    const id = req.params.id;
    const r = req.query.r as string;
    const g = req.query.g as string;
    const b = req.query.b as string;
    const light = YeeDevices.find((y) => y.db.id === id);

    try {
      //await light.setRGB([parseInt(r), parseInt(g), parseInt(b)], 250);
    } catch (error) {
      res.sendStatus(403);
      return;
    }

    res.sendStatus(200);
  });

  app.listen(_port, () => {
    console.log(`API listening at http://localhost:${_port}`);
  });
};

export default InitAPI;
