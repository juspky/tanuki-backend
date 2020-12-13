import { Sequelize } from 'sequelize';

const SequelizeConn = new Sequelize({
    dialect: 'sqlite',
    storage: './data/database.sqlite'
});

export const InitDB = () => {
    import("./Models/Yeelight");
}

export default SequelizeConn