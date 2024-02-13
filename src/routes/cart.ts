import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCartSingleById, listCartItems } from "../controllers/cart";

const cartRoutes: Router = Router();

cartRoutes.post("/add", [authMiddleware], errorHandler(addItemToCart));

cartRoutes.delete("/:id", [authMiddleware], errorHandler(deleteItemFromCart));

cartRoutes.put("/:id", [authMiddleware], errorHandler(changeQuantity));

cartRoutes.get("/list", [authMiddleware], errorHandler(listCartItems));

cartRoutes.get("/:id", [authMiddleware], errorHandler(getCartSingleById));

export default cartRoutes;