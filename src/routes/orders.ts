import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import { cancelOrder, changeStatus, createOrder, getOrderSingleById, listAllOrders, listOrders, listUserOrders } from "../controllers/orders";


const orderRoutes: Router = Router();

orderRoutes.post("/create", [authMiddleware], errorHandler(createOrder));
orderRoutes.get("/list", [authMiddleware], errorHandler(listOrders));
orderRoutes.get("/:id", [authMiddleware], errorHandler(getOrderSingleById));
orderRoutes.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

orderRoutes.get("/users/orders", [authMiddleware], errorHandler(listUserOrders));
orderRoutes.put("/:id/status", [authMiddleware], errorHandler(changeStatus));
orderRoutes.get("/list/all", [authMiddleware], errorHandler(listAllOrders));
export default orderRoutes;