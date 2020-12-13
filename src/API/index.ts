import express from "express";
import cors from "cors";
import SequelizeConn, { Yeelight } from "../Sequelize";
import YeeLights from "../Yeelight";

const InitAPI = () => {
  const app = express();
  app.use(cors());
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.set("etag", false);

  const port = 8080;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/devices", async (req, res) => {
    const yeelights = await Yeelight.findAll();
    res.send({
      yeelights,
    });
  });

  app.get("/devices/yeelight/:id/power", async (req, res) => {
    const id = req.params.id;
    const power = req.query.state;
    const light = YeeLights.find((y) => y.id === id);
    light.setPower(power);

    res.sendStatus(200);
  });

  app.get("/devices/yeelight/:id/rgb", async (req, res) => {
    const id = req.params.id;
    const r = req.query.r as string;
    const g = req.query.g as string;
    const b = req.query.b as string;
    console.log(r, g, b);
    const light = YeeLights.find((y) => y.id === id);
    try {
      await light.setRGB([parseInt(r), parseInt(g), parseInt(b)], 250);
    } catch (error) {
      res.sendStatus(403);
      return;
    }

    res.sendStatus(200);
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

export default InitAPI;
