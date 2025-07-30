import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestamps1753899316204 implements MigrationInterface {
    name = 'AddTimestamps1753899316204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "album" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "artist" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "updated_at"`);
    }

}
