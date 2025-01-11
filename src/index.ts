import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./orm/data-source";
import { tenantMiddleware } from "./middleware/tenant-middleware";
import tenantRouter from "./routes/tenant-routes";
import userRouter from "./routes/user-routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize shared database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed:", error);
  });

app.use("/tenants", tenantRouter);

app.use(tenantMiddleware);
app.use(userRouter);

app.get("/", (_req, res) => {
  res.send("Welcome to the Multi-Tenant App with TypeORM!");
});