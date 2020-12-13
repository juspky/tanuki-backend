import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import SequelizeConn from "..";

interface YeelightAttributes {
  id: string;
  name?: string;
  type: "color" | "white" | "unknown";
  power: boolean;
  connected: boolean;
  brightness: number;
  rgbR: number;
  rgbG: number;
  rgbB: number;
  hsbH: number;
  hsbS: number;
  hsbB: number;
}

interface YeelightCreationAttributes
  extends Optional<YeelightAttributes, "type"> {}

interface YeelightInstance
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
      name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "unknown",
      },
      power: {
        type: DataTypes.BOOLEAN,
      },
      connected: {
        type: DataTypes.BOOLEAN,
      },
      brightness: {
        type: DataTypes.INTEGER,
      },
      rgbR: {
        type: DataTypes.INTEGER,
      },
      rgbG: {
        type: DataTypes.INTEGER,
      },
      rgbB: {
        type: DataTypes.INTEGER,
      },
      hsbH: {
        type: DataTypes.INTEGER,
      },
      hsbS: {
        type: DataTypes.INTEGER,
      },
      hsbB: {
        type: DataTypes.INTEGER,
      },
    },
    {
      // Other model options go here
    }
  );

  Yeelight.sync({ force: true });

  return Yeelight;
};

export default YeelightModel;
