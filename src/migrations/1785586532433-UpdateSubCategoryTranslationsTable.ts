import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubCategoryTranslationsTable1785586532433 implements MigrationInterface {
    name = 'UpdateSubCategoryTranslationsTable1785586532433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_category_translations" ADD "activate" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "sub_category_translations" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sub_category_translations" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_category_translations" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "sub_category_translations" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "sub_category_translations" DROP COLUMN "activate"`);
    }

}
