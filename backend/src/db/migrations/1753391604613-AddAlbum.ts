import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAlbum1753391604613 implements MigrationInterface {
    name = 'AddAlbum1753391604613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "album" ("id" character varying NOT NULL, "name" character varying NOT NULL, "total_tracks" integer NOT NULL, "type" character varying NOT NULL, "release_date" date NOT NULL, "external_url" character varying NOT NULL, "image_url" character varying NOT NULL, "detailed_data" jsonb NOT NULL, CONSTRAINT "CHK_1791fdf28f3ca48792bb529c51" CHECK ("type" IN ('album', 'single', 'compilation')), CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "album"`);
    }

}
