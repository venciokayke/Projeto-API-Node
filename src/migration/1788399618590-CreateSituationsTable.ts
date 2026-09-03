import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSituationsTable1788399618590 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "situations",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "nameSituatiuon",
                    type: "varchar"
                },
                { 
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropTable("situations")

    }

}
