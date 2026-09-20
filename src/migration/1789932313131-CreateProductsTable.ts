import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductsTable1789932313131 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "situationId",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "categoryId",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["situationId"],
                referencedTableName: "product_situations",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["categoryId"],
                referencedTableName: "product_categories",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");

        const fkSituation = table?.foreignKeys.find((fk) =>
            fk.columnNames.includes("situationId")
        );
        if (fkSituation) {
            await queryRunner.dropForeignKey("products", fkSituation);
        }

        const fkCategory = table?.foreignKeys.find((fk) =>
            fk.columnNames.includes("categoryId")
        );
        if (fkCategory) {
            await queryRunner.dropForeignKey("products", fkCategory);
        }

        await queryRunner.dropTable("products");
    }
}