import { Sequelize } from 'sequelize';

const SequelizeConn = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

export const InitDB = () => {
    import("./Models/Yeelight");
}

export default SequelizeConn