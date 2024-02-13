import { errorHandler } from "./../error-handler";
import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  fullTextSearch,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productsRoutes: Router = Router();

productsRoutes.post(
  "/create",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);
productsRoutes.get("/", errorHandler(getProducts));
productsRoutes.get("/get/:id", errorHandler(getProductById));
productsRoutes.put(
  "/update/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productsRoutes.delete(
  "/delete/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

productsRoutes.get(
  "/full/text/search",
  [authMiddleware, adminMiddleware],
  errorHandler(fullTextSearch)
);

export default productsRoutes;
