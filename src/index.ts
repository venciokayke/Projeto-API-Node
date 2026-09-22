//Importa a biblioteca express
import express from "express";
//Importa a metadata
import "reflect-metadata";
//Importa variáveis de ambiente
import dotenv from "dotenv";
dotenv.config();

//Cria a aplicação express
const app = express();

//Cria um middleware para receber os dados no corpo da requisição
app.use(express.json());

//Incluir as controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import UsersController from "./controllers/UsersController"
import ProductSituationsController from "./controllers/ProductSituationsController"
import ProductCategoriesController from "./controllers/ProductCategoriesController"
import ProductController from "./controllers/ProductsController"

//Criar as rotas, quando chama barra, ela vai ser direcionada para a tela de login
app.use('/', AuthController);
app.use('/', SituationsController);
app.use('/', UsersController);
app.use('/', ProductSituationsController);
app.use('/', ProductCategoriesController);
app.use('/', ProductController);

//Inicia o servidor na porta 8080
app.listen(process.env.PORT, () =>{
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});