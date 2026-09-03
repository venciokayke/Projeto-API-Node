import "reflect-metadata"
import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const dialect = process.env.DB_DIALECT ?? "mysql"

export const AppDataSource = new DataSource({
    type: dialect as "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
})