import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import crypto from "crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { AppDataSource } from "../orm/data-source"; // Admin DataSource
import { Tenant } from "../orm/entities/Tenant";

interface TenantContext {
  dataSource: DataSource;
  tenantId: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantContext>();

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const tenantId = req.headers["x-tenant-id"] as string;

  if (!tenantId) {
    res.status(401).json({ error: "Tenant ID is required in the headers" });
    return;
  }

  try {
    // Use admin DataSource to fetch tenant details
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const tenant = await tenantRepository.findOneBy({ id: Number(tenantId) });

    if (!tenant) {
      res.status(404).json({ error: "Tenant not found" });
      return;
    }

    const roleName = `tenant_${tenantId}`;
    const password = crypto.createHash("sha256").update(`${tenantId}:${tenant.name}`).digest("hex");

    // Create a tenant-specific DataSource
    const tenantDataSource = new DataSource({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: roleName,
      password,
      database: "multi_tenant_db",
      synchronize: false,
      entities: ["src/orm/entities/*.ts"],
    });

    // Initialize the DataSource if not already initialized
    console.log(`Setting rls.tenant_id to: ${tenantId}`);
    if (!tenantId || isNaN(Number(tenantId))) {
      console.error(`Invalid tenant ID: ${tenantId}`);
      throw new Error("Invalid tenant ID");
    }

    if (!tenantDataSource.isInitialized) {
      await tenantDataSource.initialize();
    }

    await tenantDataSource.query(`SET rls.tenant_id = '${tenantId}';`);

    // Store tenant-specific DataSource and organizationId in AsyncLocalStorage
    tenantStorage.run({ dataSource: tenantDataSource, tenantId: tenantId }, () => {
      next();
    });
  } catch (error) {
    console.error("Error in tenant middleware:", error);
    res.status(500).json({ error: "Failed to initialize tenant context" });
  }
};