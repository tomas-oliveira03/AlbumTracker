import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrack1753391751794 implements MigrationInterface {
    name = 'AddTrack1753391751794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "track" ("id" character varying NOT NULL, "name" character varying NOT NULL, "duration" integer NOT NULL, "external_url" character varying NOT NULL, "detailed_data" jsonb NOT NULL, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "track"`);
    }

}
