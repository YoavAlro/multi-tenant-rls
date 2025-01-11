import { Router, Request, Response, NextFunction } from "express";
import { AppDataSource } from "../orm/data-source";
import { Tenant } from "../orm/entities/Tenant";
import crypto from "crypto";

const tenantRouter = Router();

tenantRouter.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Tenant name is required" });
      return;
    }

    const tenantRepository = AppDataSource.getRepository(Tenant);

    // Step 1: Create Tenant in the database
    const newTenant = tenantRepository.create({ name });
    const savedTenant = await tenantRepository.save(newTenant);

    // Step 2: Generate hashed password
    const password = crypto
      .createHash("sha256")
      .update(`${savedTenant.id}:${savedTenant.name}`)
      .digest("hex");

    const roleName = `tenant_${savedTenant.id}`;

    // Step 3: Create PostgreSQL role and grant permissions
    await AppDataSource.query(`
    CREATE ROLE "${roleName}" WITH LOGIN PASSWORD '${password}';
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${roleName}";
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "${roleName}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "${roleName}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO "${roleName}";
  `);

    await tenantRepository.save(savedTenant);

    res.status(201).json({
      message: "Tenant created successfully",
      tenant: savedTenant,
      password,
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    next(error);
  }
});

export default tenantRouter;