//Importa a biblioteca express
import express, {Request,Response} from "express";
import { AuthService } from "../services/AuthService";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.post("/", async (req:Request, res:Response)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({
                message: "Email e senha são obrigatórios!",
            });
            return;
        }

        const authService = new AuthService();

        const userData = await authService.login(email, password)

        res.status(200).json({
            message:"Login realizado com sucesso!",
            user: userData
        });
    }catch(error: any){
        res.status(401).json({
            message: error.message || "Erro ao realizar login",
        });
        return;
    }
});

//Exportar a instrução da rota
export default router