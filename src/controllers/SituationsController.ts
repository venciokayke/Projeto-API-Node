//Importa a biblioteca express
import express, {Request,Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/situations",(req: Request, res: Response)=>{
    res.send("Tela de Situations!")
});

//Cria a rota POST principal
router.post("/situations", async(req: Request, res: Response)=>{
    
    try{

        var data = req.body;

        const SituationRepository = AppDataSource.getRepository(Situation);
        
        const newSituation = SituationRepository.create(data);
        
        await SituationRepository.save(newSituation);

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

//Exportar a instrução da rota
export default router