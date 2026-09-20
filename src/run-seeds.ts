import { AppDataSource } from "./data-source";
import CreateSituationSeeds from "./seeds/CreateSituationsSeeds";
import CreateUsersSeeds from "./seeds/CreateUsersSeeds";

const runSeeds = async() =>{
    console.log("Conectando ao banco de dados...")

    await AppDataSource.initialize();

    console.log("Banco de dados conectado!")

    try{
        const situationsSeed = new CreateSituationSeeds();
        const usersSeed = new CreateUsersSeeds();

        await situationsSeed.run(AppDataSource)
        await usersSeed.run(AppDataSource)

    }catch(error){

        console.log("Erro ao executar o seed: ", error);

    }finally{

        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")

    }
}

runSeeds();