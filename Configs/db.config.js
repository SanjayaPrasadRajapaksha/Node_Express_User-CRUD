import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME = "test",
    process.env.DB_USER = "root",
    process.env.DB_PASSWORD = "sanjaya",
    {
        dialect: "mysql",
        host: process.env.DB_HOST,
    }
);
export default sequelize;