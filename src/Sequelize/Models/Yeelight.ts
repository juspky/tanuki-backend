import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import SequelizeConn from "..";

interface YeelightAttributes {
  id: string;
  host: string;
  port: number;
  connected: boolean;
  power: boolean;
  name?: string;
  type: string;
  brightness: number;
  rgb: number;
  sat: number;
  hue: number;
  ct: number;
}

interface YeelightCreationAttributes
  extends Optional<YeelightAttributes, "type" | "connected"> {}

export interface YeelightInstance
  extends Model<YeelightAttributes, YeelightCreationAttributes>,
    YeelightAttributes {}

const YeelightModel = (sequelize: Sequelize) => {
  const Yeelight = sequelize.define<YeelightInstance>(
    "Yeelight",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      host: {
        type: DataTypes.STRING,
      },
      port: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "unknown",
      },
      brightness: {
        type: DataTypes.INTEGER,
      },
      rgb: {
        type: DataTypes.INTEGER,
      },
      hue: {
        type: DataTypes.INTEGER,
      },
      sat: {
        type: DataTypes.INTEGER,
      },
      ct: {
        type: DataTypes.INTEGER,
      },
      power: {
        type: DataTypes.BOOLEAN,
      },
      connected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // Other model options go here
    }
  );

  //Yeelight.sync({ force: true });

  return Yeelight;
};

export default YeelightModel;
