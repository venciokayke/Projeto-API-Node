//Importa a biblioteca express
import express, {Request,Response} from "express";
import * as yup from "yup";
import { AuthService } from "../services/AuthService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import crypto from "crypto";

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

router.post("/recover-password", async (req:Request, res:Response) =>{
    try{

        var data = req.body;

        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("A URL é obrigatória."),
            email: yup.string().email("E-mail inválido.").required("O campo e-mail é obrigatório."),
            
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ email: data.email });

        if(!user){
            res.status(404).json({
                mesage: "Usuário não existe.",
            });
            return;
        }

        user.recoverPassword = crypto.randomBytes(32).toString("hex");

        await userRepository.save(user);

        res.status(201).json({
            message : "Gerado o link para recuperação da senha.",
            urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
            kaye: user.recoverPassword,
        });
        return;

    
    }catch(error: any){
       if (error instanceof yup.ValidationError){
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
            message : "Erro ao atualizar usuário!"
        });
        return;
    }   
});

//Exportar a instrução da rota
export default router