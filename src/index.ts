import { InitDB } from "./Sequelize";
import InitAPI from "./API";
import { InitYeelight } from "./Yeelight";

InitDB();

InitYeelight();
InitAPI();
