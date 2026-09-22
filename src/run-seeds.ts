import { AppDataSource } from "./data-source";
import CreateProductCategorySeeds from "./seeds/CreateProductCategoriesSeeds";
import CreateProductSituationSeeds from "./seeds/CreateProductSituationsSeeds";
import CreateProductsSeeds from "./seeds/CreateProductsSeeds";
import CreateSituationSeeds from "./seeds/CreateSituationsSeeds";
import CreateUsersSeeds from "./seeds/CreateUsersSeeds";

const runSeeds = async() =>{
    console.log("Conectando ao banco de dados...")

    await AppDataSource.initialize();

    console.log("Banco de dados conectado!")

    try{
        const situationsSeed = new CreateSituationSeeds();
        const productSituationSeed = new CreateProductSituationSeeds();
        const productCategorySeed = new CreateProductCategorySeeds();
        const usersSeed = new CreateUsersSeeds();
        const productsSeed = new CreateProductsSeeds();

        await situationsSeed.run(AppDataSource)
        await productSituationSeed.run(AppDataSource)
        await productCategorySeed.run(AppDataSource)
        await usersSeed.run(AppDataSource)
        await productsSeed.run(AppDataSource)

    }catch(error){

        console.log("Erro ao executar o seed: ", error);

    }finally{

        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")

    }
}

runSeeds();