import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryTranslationsTable1785586596131 implements MigrationInterface {
    name = 'UpdateCategoryTranslationsTable1785586596131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_translations" ADD "activate" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "category_translations" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category_translations" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_translations" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "category_translations" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "category_translations" DROP COLUMN "activate"`);
    }

}
