import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinTables1753392868636 implements MigrationInterface {
    name = 'AddJoinTables1753392868636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "album_artist" ("album_id" character varying NOT NULL, "artist_id" character varying NOT NULL, CONSTRAINT "PK_aca166645b803e645bd269ffef3" PRIMARY KEY ("album_id", "artist_id"))`);
        await queryRunner.query(`ALTER TABLE "album_artist" ADD CONSTRAINT "FK_d52462eb0649734833908748441" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_artist" ADD CONSTRAINT "FK_c0f768f56a2c3c0a51fb384549a" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_artist" DROP CONSTRAINT "FK_c0f768f56a2c3c0a51fb384549a"`);
        await queryRunner.query(`ALTER TABLE "album_artist" DROP CONSTRAINT "FK_d52462eb0649734833908748441"`);
        await queryRunner.query(`DROP TABLE "album_artist"`);
    }

}
