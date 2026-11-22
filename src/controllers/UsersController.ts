//Importa a biblioteca express
import express, {Request,Response} from "express";
import * as yup from "yup";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { User } from "../entity/Users";
import { PaginationService } from "../services/PaginationService";
import { Not } from "typeorm";
import bcrypt from "bcryptjs";
import {verifyToken} from "../middleware/authMiddleware"

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/users", verifyToken, async(req: Request, res: Response)=>{
    try{

        const userRepository = AppDataSource.getRepository(User);

        //recebe o número da página e defini a página 1 como padrão
        const page = Number(req.query.page) || 1;
    
       //define o limite de registros por página
        const limite = Number(req.query.limite) || 10;

        const result = await PaginationService.paginate(userRepository, page, limite, {id: "DESC"}, { situation: true })

        res.status(200).json(result);
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar usuários!"
        });
        return

    }
});

//Rota GET para visualizar um registro em específico, utilizando o ID.
router.get("/users/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const userId = Number(id);

        if(!Number.isFinite(userId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: { situation: true }
        });
   
        if(!user){
            res.status(404).json({
                message : "O usuário que você buscou não existe!"
            });
            return;
        }

        res.status(200).json(user);
        return;
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar o usuário!"
        });
        return;

    }
});

//Cria a rota POST principal
router.post("/users", async(req: Request, res: Response)=>{
    
    try{

        const data = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório.").min(3, "O campo nome deve ter no mínimo 3 caracteres."),
            email: yup.string().email("E-mail inválido.").required("O campo e-mail é obrigatório."),
            password: yup.string().required("O campo de senha é obrigatório.").min(6, "A senha deve ter pelo menos 6 caracteres."),
            situation: yup.number().required("O campo situação é obrigatório."),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);
        const situationRepository = AppDataSource.getRepository(Situation);

        const existingUser = await userRepository.findOne({
            where: {email: data.email}
        });

        const situation = await situationRepository.findOneBy({ id: Number(data.situation) });

        if(!situation){
            res.status(404).json({
                message: "A situação informada não existe!"
            });
            return;
        }

        if(existingUser){
            res.status(400).json({
                message: "Já existe um usuário cadastrado com esse e-mail.",
            });
            return;
        }

        data.password = await bcrypt.hash(data.password, 10)

        const newUser = userRepository.create({
            name: data.name,
            email: data.email,
            password: data.password,
            situation,
        });
        await userRepository.save(newUser);

        res.status(201).json({
            message : "Usuário cadastrado com sucesso!",
            user: newUser,
        });
        return;

    }catch(error){
        if (error instanceof yup.ValidationError){
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        
        res.status(500).json({
            message : "Erro ao cadastrar usuário!"
        });
        return;

    }

});

//Rota PUT para atualizar um registro em específico, utilizando o ID.
router.put("/users/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const data = req.body;
        const userId = Number(id);

        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório.").min(3, "O campo nome deve ter no mínimo 3 caracteres."),
            email: yup.string().email("E-mail inválido.").required("O campo e-mail é obrigatório."),
            situation: yup.number().required("O campo situação é obrigatório."),
        });

        await schema.validate(data, { abortEarly: false });
        
        if(!Number.isFinite(userId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const situationRepository = AppDataSource.getRepository(Situation);

        const existingUser = await userRepository.findOne({
            where: {
                email: data.email,
                id: Not(userId),
            }
        });

        if(existingUser){
            res.status(400).json({
                message: "Já existe um usuário cadastrado com esse e-mail ou id.",
            });
            return;
        }
        
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: { situation: true }
        });

        if(!user){
            res.status(404).json({
                message : "O usuário que você buscou não existe!"
            });
            return;
        }

        const { name, email, situationId } = req.body;

        if(name !== undefined) user.name = name;
        if(email !== undefined) user.email = email;

        if(situationId !== undefined){
            const situation = await situationRepository.findOneBy({ id: Number(situationId) });

            if(!situation){
                res.status(404).json({
                    message: "A situação informada não existe!"
                });
                return;
            }

            user.situation = situation;
        }

        const userUpdated = await userRepository.save(user);

        res.status(200).json({
            message : "Usuário atualizado com sucesso!",
            user: userUpdated,
        });
        return;
        
    } catch (error) {
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

router.put("/users-password/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const data = req.body;
        const userId = Number(id);

        const schema = yup.object().shape({
            password: yup.string().required("O campo de senha é obrigatório.").min(6, "A senha deve ter pelo menos 6 caracteres."),
        });

        await schema.validate(data, { abortEarly: false });
        
        if(!Number.isFinite(userId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);         
                
        const user = await userRepository.findOne({
            where: { id: userId },
        });

        if(!user){
            res.status(404).json({
                message : "O usuário que você buscou não existe!"
            });
            return;
        }

        data.password = await bcrypt.hash(data.password, 10);

        await userRepository.merge(user, data);

        const userUpdated = await userRepository.save(user);

        res.status(200).json({
            message : "Senha do usuário atualizada com sucesso!",
            user: userUpdated,
        });
        return;
        
    } catch (error) {
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

//Rota DELETE para remover um registro em específico, utilizando o ID.
router.delete("/users/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const userId = Number(id);

        if(!Number.isFinite(userId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOneBy({id : userId});

        if(!user){
            res.status(404).json({
                message : "O usuário que você buscou não existe!"
            });
            return
        }

        //Remove os dados
        await userRepository.remove(user);

        res.status(200).json({
            message : "Usuário removido com sucesso!",
        });
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao remover usuário!"
        });
        return

    }
});

//Exportar a instrução da rota
export default router