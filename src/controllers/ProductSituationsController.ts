//Importa a biblioteca express
import express, {Request,Response} from "express";
import * as yup from "yup";
import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product_Situations } from "../entity/Product_Situations";
import { PaginationService } from "../services/PaginationService";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/product-situations", async(req: Request, res: Response)=>{
    try{

        const productSituationRepository = AppDataSource.getRepository(Product_Situations);

        //recebe o número da página e defini a página 1 como padrão
        const page = Number(req.query.page) || 1;
    
       //define o limite de registros por página
        const limite = Number(req.query.limite) || 10;

        const result = await PaginationService.paginate(productSituationRepository, page, limite, {id: "DESC"})

        res.status(200).json(result);
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar situações!"
        });
        return

    }
});

//Rota GET para visualizar um registro em específico, utilizando o ID.
router.get("/product-situations/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const situationId = Number(id);

        if(!Number.isFinite(situationId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productSituationRepository = AppDataSource.getRepository(Product_Situations);

        const situation = await productSituationRepository.findOneBy({id : situationId});
   
        if(!situation){
            res.status(404).json({
                message : "A situação que você buscou não existe!"
            });
            return;
        }

        res.status(200).json(situation);
        return;
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar situação!"
        });
        return;

    }
});

//Cria a rota POST principal
router.post("/product-situations", async(req: Request, res: Response)=>{
    
    try{

        var data = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório.").min(3, "O campo nome deve ter no mínimo 3 caracteres."),
        });

        await schema.validate(data, { abortEarly: false });

        const productSituationRepository = AppDataSource.getRepository(Product_Situations);

        const existingRecord = await productSituationRepository.findOne({
            where: {
                name: data.name,
            }
        });

        if(existingRecord){
            res.status(400).json({
                message: "Já existe uma situação cadastrada com esse nome."
            });
            return;
        }
        
        const newSituation = productSituationRepository.create(data);
        
        await productSituationRepository.save(newSituation);

        res.status(201).json({
            message : "Situação criada com sucesso!",
            situation: newSituation,
        });

    }catch(error){
        if(error instanceof yup.ValidationError){
            res.status(400).json({
                message: error.errors
            });
            return;
        }


        res.status(500).json({
            message : "Erro ao cadastrar situação!"
        });

    }

});

//Rota PUT para atualizar um registro em específico, utilizando o ID.
router.put("/product-situations/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const productSituationId = Number(id);
        const data = req.body;
        data.name = data.name ?? data.nameSituation;

        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório.").min(3, "O campo nome deve ter no mínimo 3 caracteres."),
        });

        await schema.validate(data, { abortEarly: false });

        if(!Number.isFinite(productSituationId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productSituationRepository = AppDataSource.getRepository(Product_Situations);

        const existingRecord = await productSituationRepository.findOne({
            where: {
                name: data.name,
                id: Not(productSituationId),
            }
        });

        if(existingRecord){
            res.status(400).json({
                message: "Já existe uma situação cadastrada com esse nome."
            });
            return;
        }
        const situation = await productSituationRepository.findOneBy({ id: productSituationId });

        if(!situation){
            res.status(404).json({
                message : "A situação que você buscou não existe!"
            });
            return;
        }

        const { name } = data;

        if(name !== undefined){
            situation.name = name;
        }

        const updatedSituation = await productSituationRepository.save(situation);

        res.status(200).json({
            message : "Situação atualizada com sucesso!",
            situation: updatedSituation,
        });
        return;
        
    } catch (error) {
        if(error instanceof yup.ValidationError){
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        
        res.status(500).json({
            message : "Erro ao atualizar situação!"
        });
        return;

    }
});

//Rota DELETE para remover um registro em específico, utilizando o ID.
router.delete("/product-situations/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const situationId = Number(id);

        if(!Number.isFinite(situationId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productSituationRepository = AppDataSource.getRepository(Product_Situations);
        
        const situation = await productSituationRepository.findOneBy({id : situationId});

        if(!situation){
            res.status(404).json({
                message : "A situação que você buscou não existe!"
            });
            return
        }

        //Remove os dados
        await productSituationRepository.remove(situation);

        res.status(200).json({
            message : "Situação removida com sucesso!",
        });
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao remover situação!"
        });
        return

    }
});

//Exportar a instrução da rota
export default router