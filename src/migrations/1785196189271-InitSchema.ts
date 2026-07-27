import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1785196189271 implements MigrationInterface {
    name = 'InitSchema1785196189271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activate" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_id" uuid NOT NULL, "locale" character varying(10) NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_0e9b8be8a7526b1726dfb8f83ef" UNIQUE ("category_id", "locale"), CONSTRAINT "PK_9dff018a4a26a924c60d3e86432" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pincode" character varying NOT NULL, "category_id" character varying NOT NULL, "minutes" integer NOT NULL DEFAULT '60', "locale" character varying(10) NOT NULL DEFAULT 'en', "status" character varying NOT NULL DEFAULT 'waiting', "activate" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e979a0141f48176ca1deccb73bf" UNIQUE ("pincode"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "room_id" character varying NOT NULL, "player_name" character varying NOT NULL, "activate" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_81a017130f13854fbe40520aca9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_category_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sub_category_id" uuid NOT NULL, "locale" character varying(10) NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "UQ_7de23ee43d9be0d18339cba8578" UNIQUE ("sub_category_id", "locale"), CONSTRAINT "PK_cedf3dd0f109a067bca0899736f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_id" uuid NOT NULL, "activate" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sub_categories"`);
        await queryRunner.query(`DROP TABLE "sub_category_translations"`);
        await queryRunner.query(`DROP TABLE "room_player"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TABLE "category_translations"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
