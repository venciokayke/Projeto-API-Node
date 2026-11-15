//Importa a biblioteca express
import express, {Request, Response} from "express";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/test-connection",(req:Request, res:Response)=>{
    res.status(200).json("Conexão com o serviço realizada com sucesso!");
});

//Exportar a instrução da rota
export default router