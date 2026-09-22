//Importa a biblioteca express
import express, {Request,Response} from "express";
import { AppDataSource } from "../data-source";
import { Product_Situations } from "../entity/Product_Situations";
import { Product_Categories } from "../entity/Product_Categories"
import { Product } from "../entity/Products";
import { PaginationService } from "../services/PaginationService";

//Cria a aplicação express
const router = express.Router();

//Cria a rota GET principal
router.get("/products", async(req: Request, res: Response)=>{
    try{

        const productRepository = AppDataSource.getRepository(Product);

        //recebe o número da página e defini a página 1 como padrão
        const page = Number(req.query.page) || 1;
    
       //define o limite de registros por página
        const limite = Number(req.query.limite) || 10;

        const result = await PaginationService.paginate(productRepository, page, limite, {id: "DESC"}, { productSituation: true, productCategory: true })

        res.status(200).json(result);
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar produtos!"
        });
        return

    }
});

//Rota GET para visualizar um registro em específico, utilizando o ID.
router.get("/products/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const productId = Number(id);

        if(!Number.isFinite(productId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOne({
            where: { id: productId },
            relations: { productSituation: true, productCategory: true }
        });
   
        if(!product){
            res.status(404).json({
                message : "O produto que você buscou não existe!"
            });
            return;
        }

        res.status(200).json(product);
        return;
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao listar o produto!"
        });
        return;

    }
});

//Cria a rota POST principal
router.post("/products", async(req: Request, res: Response)=>{
    
    try{

        const { name, categoryId, situationId } = req.body;

        if(!name || !categoryId || !situationId){
            res.status(400).json({
                message: "Nome, categoria e situação são obrigatórios!"
            });
            return;
        }

        const productRepository = AppDataSource.getRepository(Product);
        const productSituationRepository = AppDataSource.getRepository(Product_Situations);
        const productCategoryRepository = AppDataSource.getRepository(Product_Categories);

        const situation = await productSituationRepository.findOneBy({id: Number(situationId)});

        const category = await productCategoryRepository.findOneBy({id : Number(categoryId)});

        if(!situation){
            res.status(404).json({
                message: "A situação informada não existe!"
            });
            return;
        }

        if(!category){
            res.status(404).json({
                message: "A categoria informada não existe!"
            });
            return;
        }
        
        const newProduct = productRepository.create({
            name,
            productCategory: category,
            productSituation: situation,
        });
        
        await productRepository.save(newProduct);

        res.status(201).json({
            message : "Produto cadastrado com sucesso!",
            product: newProduct,
        });
        return;

    }catch(error){

        res.status(500).json({
            message : "Erro ao cadastrar produto!"
        });
        return;

    }

});

//Rota PUT para atualizar um registro em específico, utilizando o ID.
router.put("/products/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const productId = Number(id);

        if(!Number.isFinite(productId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productRepository = AppDataSource.getRepository(Product);
        const situationRepository = AppDataSource.getRepository(Product_Situations);
        const productCategoryRepository = AppDataSource.getRepository(Product_Categories);

        const product = await productRepository.findOne({
            where: { id: productId },
            relations: { productSituation: true, productCategory: true }
        });

        if(!product){
            res.status(404).json({
                message : "O produto que você buscou não existe!"
            });
            return;
        }

        const { name, categoryId, situationId } = req.body;

        if(name !== undefined) product.name = name;

        if(situationId !== undefined){
            const situation = await situationRepository.findOneBy({ id: Number(situationId) });

            if(!situation){
                res.status(404).json({
                    message: "A situação informada não existe!"
                });
                return;
            }

            product.productSituation = situation;
        }

        if(categoryId !== undefined){
            const situation = await productCategoryRepository.findOneBy({ id: Number(categoryId) });

            if(!situation){
                res.status(404).json({
                    message: "A categoria informada não existe!"
                });
                return;
            }

            product.productCategory = situation;
        }

        const productUpdated = await productRepository.save(product);

        res.status(200).json({
            message : "Produto atualizado com sucesso!",
            product: productUpdated,
        });
        return;
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao atualizar produto!"
        });
        return;

    }
});

//Rota DELETE para remover um registro em específico, utilizando o ID.
router.delete("/products/:id", async(req: Request, res: Response)=>{
    try{

        const { id } = req.params;
        const productId = Number(id);

        if(!Number.isFinite(productId)){
            res.status(400).json({
                message: "ID inválido!"
            });
            return;
        }

        const productRepository = AppDataSource.getRepository(Product);
        
        const product = await productRepository.findOneBy({id : productId});

        if(!product){
            res.status(404).json({
                message : "O produto que você buscou não existe!"
            });
            return
        }

        //Remove os dados
        await productRepository.remove(product);

        res.status(200).json({
            message : "Produto removido com sucesso!",
        });
        return
        
    } catch (error) {
        
        res.status(500).json({
            message : "Erro ao remover produto!"
        });
        return

    }
});

//Exportar a instrução da rota
export default router