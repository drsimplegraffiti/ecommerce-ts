import { errorHandler } from "./../error-handler";
import { Router } from "express";
import {
  aggregateTotalPrice,
  createProduct,
  createWithRawQuery,
  deleteProduct,
  fullTextSearch,
  getProductById,
  getProducts,
  groupByPrice,
  rawQuery,
  rawQueryWithParams,
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

productsRoutes.get(
  "/raw/query/with/params",
  [authMiddleware, adminMiddleware],
  errorHandler(rawQueryWithParams)
);

productsRoutes.post(
  "/create/with/raw/query",
  [authMiddleware, adminMiddleware],
  errorHandler(createWithRawQuery)
);

export default productsRoutes;
