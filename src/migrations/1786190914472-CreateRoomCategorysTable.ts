import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoomCategorysTable1786190914472 implements MigrationInterface {
    name = 'CreateRoomCategorysTable1786190914472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "room_id" character varying NOT NULL, "category_id" character varying NOT NULL, "activate" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5725c49a4fdf7ce05dc8fa232ef" UNIQUE ("room_id", "category_id"), CONSTRAINT "PK_ef520f244ee34141bd897de8009" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "room_categories"`);
    }

}
