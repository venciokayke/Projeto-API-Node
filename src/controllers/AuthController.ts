//Importa a biblioteca express
import express, {Request,Response} from "express";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/",(req, res)=>{
    res.send("Bem-Vindo Pessoal! Login Aqui!")
});

//Exportar a instrução da rota
export default router