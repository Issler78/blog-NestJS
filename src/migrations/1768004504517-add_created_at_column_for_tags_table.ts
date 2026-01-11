import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtColumnForTagsTable1768004504517 implements MigrationInterface {
    name = 'AddCreatedAtColumnForTagsTable1768004504517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "created_at"`);
    }

}
