import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinTables1753392868636 implements MigrationInterface {
    name = 'AddJoinTables1753392868636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "album_artist" ("album_id" character varying NOT NULL, "artist_id" character varying NOT NULL, CONSTRAINT "PK_aca166645b803e645bd269ffef3" PRIMARY KEY ("album_id", "artist_id"))`);
        await queryRunner.query(`CREATE TABLE "track_artist" ("track_id" character varying NOT NULL, "artist_id" character varying NOT NULL, CONSTRAINT "PK_0abb2c9a9bb102f2c15a2ce4b7b" PRIMARY KEY ("track_id", "artist_id"))`);
        await queryRunner.query(`ALTER TABLE "album_artist" ADD CONSTRAINT "FK_d52462eb0649734833908748441" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album_artist" ADD CONSTRAINT "FK_c0f768f56a2c3c0a51fb384549a" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_artist" ADD CONSTRAINT "FK_44b3054dbccf94b5385e7c16a5d" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_artist" ADD CONSTRAINT "FK_bad2f837ce966cd4d0a7a4869da" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_artist" DROP CONSTRAINT "FK_bad2f837ce966cd4d0a7a4869da"`);
        await queryRunner.query(`ALTER TABLE "track_artist" DROP CONSTRAINT "FK_44b3054dbccf94b5385e7c16a5d"`);
        await queryRunner.query(`ALTER TABLE "album_artist" DROP CONSTRAINT "FK_c0f768f56a2c3c0a51fb384549a"`);
        await queryRunner.query(`ALTER TABLE "album_artist" DROP CONSTRAINT "FK_d52462eb0649734833908748441"`);
        await queryRunner.query(`DROP TABLE "track_artist"`);
        await queryRunner.query(`DROP TABLE "album_artist"`);
    }

}
