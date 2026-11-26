import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDescriptionAndPriceToProducts1795398126713 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("products", [
            new TableColumn({ name: "description", type: "longtext", isNullable: true }),
            new TableColumn({ name: "price", type: "decimal", precision: 10, scale: 2, isNullable: true }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("products", ["description", "price"]);
    }
}
