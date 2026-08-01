import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOtpTable1785583051086 implements MigrationInterface {
    name = 'CreateOtpTable1785583051086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."otps_type_enum" AS ENUM('email', 'phone')`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "target" character varying NOT NULL, "type" "public"."otps_type_enum" NOT NULL, "code" character varying NOT NULL, "activate" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TYPE "public"."otps_type_enum"`);
    }

}
