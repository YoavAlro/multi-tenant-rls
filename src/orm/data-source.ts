import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "password",
  database: "multi_tenant_db",
  synchronize: true,
  logging: true,
  entities: ["src/orm/entities/*.ts"],
  migrations: ["src/orm/migrations/*.ts"],
});