import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageTable1736606038360 implements MigrationInterface {
    name = 'AddImageTable1736606038360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" integer, "createdById" integer, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_44387fb29706f3a37ec41c71104" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_54915a9d5a77e86c48fe9590b24" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_54915a9d5a77e86c48fe9590b24"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_44387fb29706f3a37ec41c71104"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
