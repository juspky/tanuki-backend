import { InitDB } from "./Sequelize";
import InitAPI from "./API";
import { InitYeelight } from "./Yeelight";

const Init = async () => {
  await InitDB();

  InitYeelight();
  InitAPI();
};

Init();