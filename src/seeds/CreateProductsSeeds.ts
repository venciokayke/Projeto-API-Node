import { DataSource } from "typeorm"
import { Product } from "../entity/Products"
import { Product_Situations } from "../entity/Product_Situations";
import { Product_Categories } from "../entity/Product_Categories"

export default class CreateProductsSeeds {

    public async run (dataSource: DataSource):Promise<void>{
        console.log("Iniciando o seed para a tabela 'products'.");

        
        const productCategoryRepository = dataSource.getRepository(Product_Categories);
        const productSituationRepository = dataSource.getRepository(Product_Situations);
        const productRepository = dataSource.getRepository(Product);

        const existingCount = await productRepository.count();

        if(existingCount > 0){
            console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const situations = await productSituationRepository.find();
        const categories = await productCategoryRepository.find();

        if (situations.length === 0) {
            console.log("A tabela 'product_situations' está vazia. Crie as situações antes de inserir produtos.");
            return;
        }

        if (categories.length === 0) {
            console.log("A tabela 'product_categories' está vazia. Crie as situações antes de inserir produtos.");
            return;
        }

        const products = [
            {
                name: "RTX 5090",
                slug: "RTX 5090",
                description: "Placa de vídeo GeForce RTX 5090.",
                price: "15999.90",
                productSituation: situations[0],
                productCategory: categories[0]
            },
            {
                name: "Caderno 10 Matérias Tilibra",
                slug: "Caderno 10 Matérias Tilibra",
                description: "Caderno espiral Tilibra com divisórias para 10 matérias.",
                price: "39.90",
                productSituation: situations[2],
                productCategory: categories[1]
            },
            {
                name: "Raquete de Tênis",
                slug: "Raquete de Tênis",
                description: "Raquete para treinos e partidas de tênis.",
                price: "249.90",
                productSituation: situations[1],
                productCategory: categories[2]
            }
        ]
        
        await productRepository.save(products);

        console.log("Seed concluido com sucesso: produtos cadastrados!")

    }

}
