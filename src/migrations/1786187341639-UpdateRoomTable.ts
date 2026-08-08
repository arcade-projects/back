import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoomTable1786187341639 implements MigrationInterface {
    name = 'UpdateRoomTable1786187341639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "category_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "category_id" character varying NOT NULL`);
    }

}
