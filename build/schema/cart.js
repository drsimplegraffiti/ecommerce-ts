"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeQuantitySchema = exports.CreateCartSchema = void 0;
const zod_1 = require("zod");
exports.CreateCartSchema = zod_1.z.object({
    productId: zod_1.z.number(),
    quantity: zod_1.z.number().positive()
});
exports.changeQuantitySchema = zod_1.z.object({
    quantity: zod_1.z.number().positive()
});