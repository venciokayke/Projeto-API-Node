//Importa a biblioteca express
import express, {Request,Response} from "express";
import * as yup from "yup";
import { AuthService } from "../services/AuthService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        var message_content = {
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Recuperar Senha",
            text: `Prezado(a) ${user.name},\n\nRecebemos sua solicitação de recuperação de senha.\n\nPara criar uma nova senha, acesse o link abaixo.\n${data.urlRecoverPassword}?email=${encodeURIComponent(data.email)}&key=${user.recoverPassword}\n\nSe você não solicitou a recuperação, pode ignorar esta mensagem.`,
            html: `<p>Prezado(a) ${user.name.replace(/&/g, "&amp;").replace(/</g, "&lt;")},</p>
                <p>Recebemos sua solicitação de recuperação de senha.</p>
                <p><a href="${/^https?:\/\//i.test(data.urlRecoverPassword) ? data.urlRecoverPassword.replace(/&/g, "&amp;").replace(/"/g, "&quot;") : "#"}?email=${encodeURIComponent(data.email)}&amp;key=${user.recoverPassword}">Criar nova senha</a></p>
                <p>Se você não solicitou a recuperação, pode ignorar esta mensagem.</p>`
        }

        transport.sendMail( message_content, function(err){
            if (err) {
                console.log("erro ao enviar email: ", err);
                 res.status(500).json({
                message: "E-mail não enviado, tente novamente!"
            });
            return
            } else {
                res.status(200).json({
                    message : "Gerado o link para recuperação da senha. Verifique seu email!",
                    urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`
                });
                return;
            }
        });
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
