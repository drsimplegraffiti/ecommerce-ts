"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const auth_1 = __importDefault(require("../middlewares/auth"));
const orders_1 = require("../controllers/orders");
const orderRoutes = (0, express_1.Router)();
orderRoutes.post("/create", [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.createOrder));
orderRoutes.get("/list", [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.listOrders));
orderRoutes.get("/:id", [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.getOrderSingleById));
orderRoutes.put("/:id/cancel", [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.cancelOrder));
orderRoutes.get("/users/orders", [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.listUserOrders));
orderRoutes.put("/:id/status", [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.changeStatus));
orderRoutes.get("/list/all", [auth_1.default], (0, error_handler_1.errorHandler)(orders_1.listAllOrders));
exports.default = orderRoutes;
