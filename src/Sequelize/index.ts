import { Sequelize } from 'sequelize';

const SequelizeConn = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.sqlite'
});

export const InitDB = async () => {
    await import("./Models/Yeelight");
}

export default SequelizeConn