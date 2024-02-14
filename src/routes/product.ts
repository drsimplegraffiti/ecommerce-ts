import { errorHandler } from "./../error-handler";
import { Router } from "express";
import {
  aggregateTotalPrice,
  createProduct,
  deleteProduct,
  fullTextSearch,
  getProductById,
  getProducts,
  groupByPrice,
  rawQuery,
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

productsRoutes.get(
  "/aggregate/total/price",
  [authMiddleware, adminMiddleware],
  errorHandler(aggregateTotalPrice)
);

productsRoutes.get(
  "/group/by/price",
  [authMiddleware, adminMiddleware],
  errorHandler(groupByPrice)
);

productsRoutes.get(
  "/raw/query",
  [authMiddleware, adminMiddleware],
  errorHandler(rawQuery)
);

export default productsRoutes;
