import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubCategoriesTable1785583916781 implements MigrationInterface {
    name = 'UpdateSubCategoriesTable1785583916781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_categories" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sub_categories" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "sub_categories" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sub_categories" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_categories" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "sub_categories" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "sub_categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sub_categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
