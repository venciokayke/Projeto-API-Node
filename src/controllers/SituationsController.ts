//Importa a biblioteca express
import express, {Request,Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/situations", async(req: Request, res: Response)=>{
    try{

        const situationRepository = AppDataSource.getRepository(Situation);
        
        const situations = await situationRepository.find();

        res.status(200).json(situations);
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar situações!"
        });
        return

    }
});

//Rota GET para visualizar um registro em específico, utilizando o ID.
router.get("/situations/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);
        
        const situation = await situationRepository.findOneBy({id : parseInt(id)});

        if(!situation){
            res.status(404).json({
                message : "A situação que você buscou não existe!"
            });
            return
        }

        res.status(200).json(situation);
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar situação!"
        });
        return

    }
});

//Cria a rota POST principal
router.post("/situations", async(req: Request, res: Response)=>{
    
    try{

        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);
        
        const newSituation = situationRepository.create(data);
        
        await situationRepository.save(newSituation);

        res.status(201).json({
            message : "Situação criada com sucesso!",
            situation: newSituation,
        });

    }catch(error){

        res.status(500).json({
            message : "Erro ao cadastrar situação!"
        });

    }

});

//Rota DELETE para remover um registro em específico, utilizando o ID.
router.delete("/situations/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);
        
        const situation = await situationRepository.findOneBy({id : parseInt(id)});

        if(!situation){
            res.status(404).json({
                message : "A situação que você buscou não existe!"
            });
            return
        }

        //Remove os dados
        await situationRepository.remove(situation);

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