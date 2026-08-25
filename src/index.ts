//Importa a biblioteca express
import express from "express";
//Importa a metadata
import "reflect-metadata";
//Importa variáveis de ambiente
import dotenv from "dotenv";
dotenv.config();

//Cria a aplicação express
const app = express();

//Incluir as controllers
import login from "./controllers/login";


//Criar as rotas, quando chama barra, ela vai ser direcionada para a tela de login
app.use('/', login);

//Inicia o servidor na porta 8080
app.listen(process.env.PORT, () =>{
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});