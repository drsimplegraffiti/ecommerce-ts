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
exports.getCartSingleById = exports.listCartItems = exports.changeQuantity = exports.deleteItemFromCart = exports.addItemToCart = void 0;
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const successresponse_1 = require("../response/successresponse");
const bad_request_1 = require("../exceptions/bad-request");
const cart_1 = require("../schema/cart");
const addItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cart_1.CreateCartSchema.parse(req.body);
    let product; // Product is a type from prisma
    try {
        product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId,
            },
        });
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Item not found", root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    const cart = yield __1.prismaClient.cart.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity,
        },
    });
    return (0, successresponse_1.successResponse)(res, cart, "Item added to cart successfully");
});
exports.addItemToCart = addItemToCart;
const deleteItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartId = req.params.id;
    const cart = yield __1.prismaClient.cart.findFirst({
        where: {
            id: Number(cartId),
        },
    });
    if (!cart) {
        throw new not_found_1.NotFoundException("Item not found", root_1.ErrorCode.CART_ITEM_NOT_FOUND);
    }
    if (cart.userId !== req.user.id) {
        throw new bad_request_1.BadRequestsException("You are not authorized to delete this item", root_1.ErrorCode.UNAUTHORIZED);
    }
    yield __1.prismaClient.cart.delete({
        where: {
            id: Number(cartId),
        },
    });
    return (0, successresponse_1.successResponse)(res, null, "Item deleted successfully");
});
exports.deleteItemFromCart = deleteItemFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartId = req.params.id;
    console.log(cartId);
    const validatedData = cart_1.changeQuantitySchema.parse(req.body);
    const cart = yield __1.prismaClient.cart.findFirst({
        where: {
            id: Number(cartId),
        },
    });
    if (!cart) {
        throw new not_found_1.NotFoundException("Item not found", root_1.ErrorCode.CART_ITEM_NOT_FOUND);
    }
    if (cart.userId !== req.user.id) {
        throw new bad_request_1.BadRequestsException("You are not authorized to change the quantity of this item", root_1.ErrorCode.UNAUTHORIZED);
    }
    yield __1.prismaClient.cart.update({
        where: {
            id: Number(cartId),
        },
        data: {
            quantity: validatedData.quantity,
        },
    });
    return (0, successresponse_1.successResponse)(res, null, "Quantity updated successfully");
});
exports.changeQuantity = changeQuantity;
const listCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = req.user;
    const cart = yield __1.prismaClient.cart.findMany({
        where: {
            userId: loggedInUser.id,
        },
        include: {
            product: true,
        },
    });
    return (0, successresponse_1.successResponse)(res, cart, "Cart items fetched successfully");
});
exports.listCartItems = listCartItems;
const getCartSingleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = req.user;
    const cartId = req.params.id;
    const cart = yield __1.prismaClient.cart.findFirst({
        where: {
            id: Number(cartId),
        },
        include: {
            product: true,
        },
    });
    if (!cart) {
        throw new not_found_1.NotFoundException("Item not found", root_1.ErrorCode.CART_ITEM_NOT_FOUND);
    }
    if (cart.userId !== loggedInUser.id) {
        throw new bad_request_1.BadRequestsException("You are not authorized to view this item", root_1.ErrorCode.UNAUTHORIZED);
    }
    return (0, successresponse_1.successResponse)(res, cart, "Cart item fetched successfully");
});
exports.getCartSingleById = getCartSingleById;
