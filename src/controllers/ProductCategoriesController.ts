//Importa a biblioteca express
import express, {Request,Response} from "express";
import { AppDataSource } from "../data-source";
import { Product_Categories } from "../entity/Product_Categories";
import { PaginationService } from "../services/PaginationService";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/product-categories", async(req: Request, res: Response)=>{
    try{

        const productCategoryRepository = AppDataSource.getRepository(Product_Categories);

        //recebe o número da página e defini a página 1 como padrão
        const page = Number(req.query.page) || 1;
    
       //define o limite de registros por página
        const limite = Number(req.query.limite) || 10;

        const result = await PaginationService.paginate(productCategoryRepository, page, limite, {id: "DESC"})

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
router.get("/product-categories/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const situationId = Number(id);

        if(!Number.isFinite(situationId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productCategoryRepository = AppDataSource.getRepository(Product_Categories);

        const situation = await productCategoryRepository.findOneBy({id : situationId});
   
        if(!situation){
            res.status(404).json({
                message : "A categoria que você buscou não existe!"
            });
            return;
        }

        res.status(200).json(situation);
        return;
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar categoria!"
        });
        return;

    }
});

//Cria a rota POST principal
router.post("/product-categories", async(req: Request, res: Response)=>{
    
    try{

        var data = req.body;

        const productCategoryRepository = AppDataSource.getRepository(Product_Categories);
        
        const newSituation = productCategoryRepository.create(data);
        
        await productCategoryRepository.save(newSituation);

        res.status(201).json({
            message : "Categoria criada com sucesso!",
            situation: newSituation,
        });

    }catch(error){

        res.status(500).json({
            message : "Erro ao cadastrar categoria!"
        });

    }

});

//Rota PUT para atualizar um registro em específico, utilizando o ID.
router.put("/product-categories/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const categoryId = Number(id);

        if(!Number.isFinite(categoryId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productCategoryRepository = AppDataSource.getRepository(Product_Categories);
        const category = await productCategoryRepository.findOneBy({ id: categoryId });

        if(!category){
            res.status(404).json({
                message : "A categoria que você buscou não existe!"
            });
            return;
        }

        const { name } = req.body;

        if(name !== undefined){
            category.name = name;
        }

        const updatedCategory = await productCategoryRepository.save(category);

        res.status(200).json({
            message : "Categoria atualizada com sucesso!",
            category: updatedCategory,
        });
        return;
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao atualizar categoria!"
        });
        return;

    }
});

//Rota DELETE para remover um registro em específico, utilizando o ID.
router.delete("/product-categories/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const categoryId = Number(id);

        if(!Number.isFinite(categoryId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productCategoryRepository = AppDataSource.getRepository(Product_Categories);
        
        const category = await productCategoryRepository.findOneBy({id : categoryId});

        if(!category){
            res.status(404).json({
                message : "A categoria que você buscou não existe!"
            });
            return
        }

        //Remove os dados
        await productCategoryRepository.remove(category);

        res.status(200).json({
            message : "Categoria removida com sucesso!",
        });
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao remover categoria!"
        });
        return

    }
});

//Exportar a instrução da rota
export default router