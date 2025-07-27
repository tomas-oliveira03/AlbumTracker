import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAlbumTypeIndex1753629610601 implements MigrationInterface {
    name = 'RemoveAlbumTypeIndex1753629610601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "CHK_1791fdf28f3ca48792bb529c51"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "CHK_1791fdf28f3ca48792bb529c51" CHECK (((type)::text = ANY ((ARRAY['album'::character varying, 'single'::character varying, 'compilation'::character varying])::text[])))`);
    }

}
