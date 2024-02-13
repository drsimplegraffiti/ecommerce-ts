import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./product";
import userRoutes from "./user";
import cartRoutes from "./cart";
import orderRoutes from "./orders";

const rootRouter:Router = Router();


rootRouter.use("/auth", authRoutes);
rootRouter.use("/product", productsRoutes);
rootRouter.use("/user", userRoutes)
rootRouter.use("/cart",cartRoutes)
rootRouter.use("/orders",orderRoutes)

export default rootRouter;
