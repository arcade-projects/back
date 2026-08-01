import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoriesTable1785583742218 implements MigrationInterface {
    name = 'UpdateCategoriesTable1785583742218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
