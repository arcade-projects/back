import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoomPlayersTable1785586117253 implements MigrationInterface {
    name = 'UpdateRoomPlayersTable1785586117253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_players" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "room_id" character varying NOT NULL, "user_id" character varying, "is_owner" boolean NOT NULL DEFAULT false, "player_name" character varying NOT NULL, "activate" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fa8e2bcf2f068c20f4c3e05ab5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "room_players"`);
    }

}
