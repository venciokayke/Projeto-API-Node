import "reflect-metadata"
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Situation } from "./entity/Situations"
import { User } from "./entity/Users"
import { Product } from "./entity/Products";
import { Product_Categories } from "./entity/Product_Categories";
import { Product_Situations } from "./entity/Product_Situations";

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
    entities: [Situation, User, Product, Product_Categories, Product_Situations],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
})

//Inicializa a conexão com o BD
AppDataSource.initialize().then(()=>{
    console.log("Conexão com o bd sucedida!");
}).catch((error)=>{
    console.log("Erro na conexão com o BD.", error);
});