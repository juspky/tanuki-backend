import "./Sequelize";

import InitAPI from "./API";
import { InitYeelight } from "./Yeelight";

const Init = async () => {
  InitYeelight();
  InitAPI();
};

Init();
