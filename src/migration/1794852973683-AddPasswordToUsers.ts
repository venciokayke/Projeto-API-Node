import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPasswordToUsers1794852973683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: "password",
            type: "varchar",
            isNullable: false,
        }));

        //Ajusta a ordem da coluna
        await queryRunner.query(`ALTER TABLE users MODIFY COLUMN password varchar(255) AFTER email`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "password");
    }
}
