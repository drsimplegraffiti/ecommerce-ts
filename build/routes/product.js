"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("./../error-handler");
const express_1 = require("express");
const product_1 = require("../controllers/product");
const auth_1 = __importDefault(require("../middlewares/auth"));
const admin_1 = __importDefault(require("../middlewares/admin"));
const productsRoutes = (0, express_1.Router)();
productsRoutes.post("/create", [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(product_1.createProduct));
productsRoutes.get("/", (0, error_handler_1.errorHandler)(product_1.getProducts));
productsRoutes.get("/get/:id", (0, error_handler_1.errorHandler)(product_1.getProductById));
productsRoutes.put("/update/:id", [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(product_1.updateProduct));
productsRoutes.delete("/delete/:id", [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(product_1.deleteProduct));
productsRoutes.get("/full/text/search", [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(product_1.fullTextSearch));
exports.default = productsRoutes;
