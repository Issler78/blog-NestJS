import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueForArticleTitle1769008039549 implements MigrationInterface {
    name = 'SetDefaultValueForArticleTitle1769008039549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "title" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "title" DROP DEFAULT`);
    }

}
