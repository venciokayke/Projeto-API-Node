import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSlugToProducts1794854453088 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('products', new TableColumn({
            name: "slug",
            type:"varchar",
            isUnique: true,
            isNullable: false,
        }))

        //Ajusa a ordem da coluna
        await queryRunner.query(`ALTER TABLE products MODIFY COLUMN slug varchar(255) NOT NULL AFTER name`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug");
    }

}
