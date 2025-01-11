import { Router, Request, Response, NextFunction } from "express";
import { tenantStorage } from "../middleware/tenant-middleware";
import { User } from "../orm/entities/User";
import { Image } from "../orm/entities/Image";

const userRouter = Router();

userRouter.post("/users", async (req: Request, res: Response): Promise<void> => {
  const tenantContext = tenantStorage.getStore();

  if (!tenantContext) {
    res.status(500).json({ error: "Tenant context is not available" });
    return;
  }

  const { dataSource } = tenantContext;
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  try {
    const userRepository = dataSource.getRepository(User);

    const newUser = userRepository.create({ name, email });
    const savedUser = await userRepository.save(newUser);

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

userRouter.get("/users", async (req: Request, res: Response): Promise<void> => {
  const tenantContext = tenantStorage.getStore();

  if (!tenantContext) {
    res.status(500).json({ error: "Tenant context is not available" });
    return;
  }

  const { dataSource, tenantId } = tenantContext;

  try {
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find();

    res.json({ tenantId: tenantId, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

userRouter.get("/images", async (req: Request, res: Response): Promise<void> => {
  const tenantContext = tenantStorage.getStore();

  if (!tenantContext) {
    console.error("Tenant context is missing");
    res.status(500).json({ error: "Tenant context is not available" });
    return;
  }

  const { dataSource, tenantId } = tenantContext;

  try {
    // Execute the query
    const imageRepository = dataSource.getRepository(Image);
    const images = await imageRepository.find();
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

userRouter.post(
  "/images",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url, userId, tenantId } = req.body;

      const tenantContext = tenantStorage.getStore();

      if (!tenantContext) {
        res.status(500).json({ error: "Tenant context is not available" });
        return;
      }

      const { dataSource } = tenantContext;

      const userRepository = dataSource.getRepository(User);
      const imageRepository = dataSource.getRepository(Image);

      const user = await userRepository.findOneBy({ id: userId });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const newImage = imageRepository.create({
        url,
        createdBy: user,
        tenant: { id: tenantId }, // Assuming the tenant relationship is populated with ID
      });

      await imageRepository.save(newImage);
      res.json(newImage);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;