//Importa a biblioteca express
import express, {Request,Response} from "express";

//Importar o arquivo com as credenciais do banco de dados
import { AppDataSource } from "../data-source"

//Cria a aplicação express
const router = express.Router();

//Inicializa a conexão com o BD
AppDataSource.initialize().then(()=>{
    console.log("Conexão com o bd sucedida!");
}).catch((error)=>{
    console.log("Erro na conexão com o BD.", error);
});


//Cria a rota GET principal
router.get("/",(req, res)=>{
    res.send("Bem-Vindo Pessoal! Login Aqui!")
});

//Exportar a instrução da rota
export default router