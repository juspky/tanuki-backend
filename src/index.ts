import "./Sequelize";

import _ from "lodash";
import { StartYeelightDiscoveryService } from "./Services/Yeelight";
import { InitAudioService, StartAudioService } from "./Services/Audio";
import InitAPI from "./API";
import { InitWebsocket } from "./Websocket/Server";
import { StartYeelightMusicServer } from "./Services/Yeelight/musicServer";

const Boot = () => {
  Init();
  Startup();
};

const Init = () => {
  InitWebsocket(parseInt(process.env.WS_PORT));
  InitAPI(parseInt(process.env.PORT));
  InitAudioService();
};

const Startup = () => {
  StartYeelightMusicServer(parseInt(process.env.YEELIGHT_MUSIC_SERVER_PORT));
  StartAudioService();
  StartYeelightDiscoveryService();
};

_.delay(Boot, 1000);
