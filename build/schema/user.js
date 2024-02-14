"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRoleSchema = exports.UpdateUserSchema = exports.AddressSchema = exports.UpdateProductSchema = exports.ProductSchema = exports.LoginSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z
        .string()
        .email()
        .transform((val) => val.toLowerCase()),
    password: zod_1.z.string().min(6)
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email()
        .transform((val) => val.toLowerCase()),
    password: zod_1.z.string().min(6)
});
exports.ProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    price: zod_1.z.number().positive(),
    tags: zod_1.z.array(zod_1.z.string()),
    description: zod_1.z.string().min(10)
});
exports.UpdateProductSchema = zod_1.z.object({
    // name: z.string().min(3).optional(),
    name: zod_1.z.string().min(3),
    price: zod_1.z.number().positive(),
    tags: zod_1.z.array(zod_1.z.string()),
    description: zod_1.z.string().min(10)
});
exports.AddressSchema = zod_1.z.object({
    lineOne: zod_1.z.string(),
    lineTwo: zod_1.z.string().nullable(),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    pincode: zod_1.z.string().length(6)
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    defaultShippingAddress: zod_1.z.number().optional(),
    defaultBillingAddress: zod_1.z.number().optional()
});
exports.changeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["ADMIN", "USER"])
});
