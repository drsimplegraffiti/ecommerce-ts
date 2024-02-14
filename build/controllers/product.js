"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullTextSearch = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const __1 = require("..");
const user_1 = require("../schema/user");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const successresponse_1 = require("../response/successresponse");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.ProductSchema.parse(req.body);
    const productExists = yield __1.prismaClient.product.findFirst({
        where: {
            name: req.body.name,
        },
    });
    const product = yield __1.prismaClient.product.create({
        data: Object.assign(Object.assign({}, req.body), { tags: req.body.tags.join(",") }),
    });
    return res.json(product);
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, offset, orderBy, search, filter } = req.query;
    const products = yield __1.prismaClient.product.findMany({
        where: {
            name: {
                contains: search ? String(search) : "",
            },
            tags: {
                contains: filter ? String(filter) : "",
            },
        },
        take: Number(limit) || 10,
        skip: Number(offset) || 0,
        orderBy: {
            name: orderBy === "name" ? "asc" : "desc",
        },
    });
    const dataInfo = {
        count: products.length,
        limit: Number(limit) || 10,
        offset: Number(offset) || 0,
        orderBy: orderBy === "name" ? "asc" : "desc",
        hasPrevious: Number(offset) > 0,
        hasNext: products.length === (Number(limit) || 10),
        data: products,
    };
    return res.json(dataInfo);
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: Number(id),
            },
        });
        return (0, successresponse_1.successResponse)(res, product, "Product found");
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.UpdateProductSchema.parse(req.body);
    const { id } = req.params;
    const product = req.body;
    if (product.tags) {
        product.tags = product.tags.join(",");
    }
    try {
        const updatedProduct = yield __1.prismaClient.product.update({
            where: {
                id: Number(id),
            },
            data: product,
        });
        return res.json(updatedProduct);
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield __1.prismaClient.product.delete({
        where: {
            id: Number(id),
        },
    });
    return res.json({ message: "Product deleted" });
});
exports.deleteProduct = deleteProduct;
const fullTextSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //add pagination
    var _a, _b, _c;
    const products = yield __1.prismaClient.product.findMany({
        where: {
            name: {
                search: (_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toString(),
            },
            description: {
                search: (_b = req.query.q) === null || _b === void 0 ? void 0 : _b.toString(),
            },
            tags: {
                search: (_c = req.query.q) === null || _c === void 0 ? void 0 : _c.toString(),
            },
        },
    });
    return res.json(products);
});
exports.fullTextSearch = fullTextSearch;
