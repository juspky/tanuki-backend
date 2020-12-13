import "./Sequelize";

import InitAPI from "./API";
import { StartYeelightDiscoveryService } from "./Yeelight";
import _ from "lodash";

const Init = () => {
  StartYeelightDiscoveryService();
  InitAPI();
};

_.delay(Init, 1000);
