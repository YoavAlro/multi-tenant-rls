import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRlsToImage1736606672117 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure tenantId is NOT NULL
        await queryRunner.query(`ALTER TABLE "image" ALTER COLUMN "tenantId" SET NOT NULL`);

        // Enable Row-Level Security on the Image table
        await queryRunner.query(`ALTER TABLE "image" ENABLE ROW LEVEL SECURITY`);

        // Add the RLS policy for the tenantId
        await queryRunner.query(`
            CREATE POLICY tenant_image_policy
            ON "image"
            USING ("tenantId" = current_setting('rls.tenant_id')::integer)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the RLS policy
        await queryRunner.query(`DROP POLICY tenant_image_policy ON "image"`);

        // Disable Row-Level Security on the Image table
        await queryRunner.query(`ALTER TABLE "image" DISABLE ROW LEVEL SECURITY`);

        // Allow tenantId to be nullable again
        await queryRunner.query(`ALTER TABLE "image" ALTER COLUMN "tenantId" DROP NOT NULL`);
    }
}