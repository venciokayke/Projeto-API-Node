import { AppDataSource } from "./data-source";
import CreateSituationSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async() =>{
    console.log("Conectando ao banco de dados...")

    await AppDataSource.initialize();

    console.log("Canco de dados conectado!")

    try{
        //Cria a instância da classe de seed
        const situationsSeed = new CreateSituationSeeds();

        //Ecxcecuta as Seeds
        await situationsSeed.run(AppDataSource)

    }catch(error){

        console.log("Erro ao executar o seed: ", error);

    }finally{

        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")

    }
}

runSeeds();