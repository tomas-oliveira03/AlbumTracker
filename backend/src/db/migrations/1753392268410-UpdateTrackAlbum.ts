import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTrackAlbum1753392268410 implements MigrationInterface {
    name = 'UpdateTrackAlbum1753392268410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" ADD "album_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_5902805b5cdc8b4fcf983f7df52" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_5902805b5cdc8b4fcf983f7df52"`);
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "album_id"`);
    }

}
