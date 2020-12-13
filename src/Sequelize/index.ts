import { Sequelize } from "sequelize";
import YeelightModel from "./Models/Yeelight";

const SequelizeConn = new Sequelize({
  dialect: "sqlite",
  storage: "./data/database.sqlite",
});

export const Yeelight = YeelightModel(SequelizeConn);

export default SequelizeConn;
