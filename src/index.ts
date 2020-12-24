import "./Sequelize";

import InitAPI from "./API";
import { StartYeelightDiscoveryService } from "./Yeelight";
import _ from "lodash";
import InitAudio from "./Audio";

const Init = () => {
  StartYeelightDiscoveryService();
  InitAudio();
  InitAPI();
};

_.delay(Init, 1000);
