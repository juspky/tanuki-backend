import "./Sequelize";

import InitAPI from "./API";
import { InitYeelight } from "./Yeelight";
import _ from "lodash";

const Init = () => {
  InitYeelight();
  InitAPI();
};

_.delay(Init, 1000);
