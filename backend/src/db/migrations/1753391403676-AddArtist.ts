import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArtist1753391403676 implements MigrationInterface {
    name = 'AddArtist1753391403676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artist" ("id" character varying NOT NULL, "name" character varying NOT NULL, "external_url" character varying NOT NULL, "image_url" character varying NOT NULL, "detailed_data" jsonb NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "artist"`);
    }

}
