import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1785583550242 implements MigrationInterface {
    name = 'UpdateUsersTable1785583550242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "create_at" TO "created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "create_at"`);
    }

}
