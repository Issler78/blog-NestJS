import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueForArticleBody1769008025349 implements MigrationInterface {
    name = 'SetDefaultValueForArticleBody1769008025349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" DROP DEFAULT`);
    }

}
