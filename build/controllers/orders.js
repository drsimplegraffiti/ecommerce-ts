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
exports.listUserOrders = exports.changeStatus = exports.listAllOrders = exports.getOrderSingleById = exports.cancelOrder = exports.listOrders = exports.createOrder = void 0;
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const successresponse_1 = require("../response/successresponse");
const bad_request_1 = require("../exceptions/bad-request");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //1 create transaction
    // 2 list all the cart items and proceed if not empty
    // 3 calculate the total amount
    // 4 fetch the address of the user
    // 5. define computed field for formatted address on address module
    // 6. create event for order created
    return yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const cartItems = yield __1.prismaClient.cart.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                product: true,
            },
        });
        if (cartItems.length === 0) {
            return res.json({
                message: "Cart is empty",
            });
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + current.quantity * +current.product.price;
        }, 0);
        const address = yield __1.prismaClient.address.findFirst({
            where: {
                id: req.user.defaultAddressId,
            },
        });
        if (!address) {
            throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        const order = yield tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address.formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity,
                        };
                    }),
                },
            },
        });
        const orderEvent = yield tx.orderEvent.create({
            data: {
                orderId: order.id,
            },
        });
        yield tx.cart.deleteMany({
            where: {
                userId: req.user.id,
            },
        });
        return (0, successresponse_1.successResponse)(res, order, "Order created successfully");
    }));
});
exports.createOrder = createOrder;
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield __1.prismaClient.order.findMany({
        where: {
            userId: req.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            products: {
                include: {
                    product: true,
                },
            },
        },
    });
    return (0, successresponse_1.successResponse)(res, orders, "Orders fetched successfully");
});
exports.listOrders = listOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (!orderId == null || orderId == "") {
        throw new bad_request_1.BadRequestsException("Order id is required", root_1.ErrorCode.ORDER_ID_REQUIRED);
    }
    const order = yield __1.prismaClient.order.findFirst({
        where: {
            id: Number(orderId),
            userId: req.user.id,
        },
    });
    if (!order) {
        throw new not_found_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
    if (order.status === "CANCELLED") {
        throw new bad_request_1.BadRequestsException("Order already cancelled", root_1.ErrorCode.ORDER_ALREADY_CANCELLED);
    }
    yield __1.prismaClient.order.update({
        where: {
            id: Number(orderId),
        },
        data: {
            status: "CANCELLED",
        },
    });
    yield __1.prismaClient.orderEvent.create({
        data: {
            orderId: Number(orderId),
            status: "CANCELLED",
        },
    });
    return (0, successresponse_1.successResponse)(res, null, "Order cancelled successfully");
});
exports.cancelOrder = cancelOrder;
const getOrderSingleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const order = yield __1.prismaClient.order.findFirst({
            where: {
                id: Number(orderId),
                userId: req.user.id,
            },
            include: {
                products: true,
                events: true,
            },
        });
        if (!order) {
            throw new not_found_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
        }
        return (0, successresponse_1.successResponse)(res, order, "Order fetched successfully");
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.getOrderSingleById = getOrderSingleById;
const listAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //add pagination, limit and offset, status filter
    let whereClause = {};
    let skip = 0;
    let take = 10;
    let page = 1;
    let limit = 10;
    let sort = "id";
    let filter = "";
    let status = "";
    if (req.query.page) {
        page = Number(req.query.page);
    }
    if (req.query.limit) {
        limit = Number(req.query.limit);
    }
    if (req.query.sort) {
        sort = String(req.query.sort);
    }
    if (req.query.filter) {
        filter = String(req.query.filter);
    }
    if (req.query.status) {
        status = String(req.query.status);
    }
    skip = (page - 1) * limit;
    take = limit;
    //check if status is valid
    const validStatus = ["PENDING", "CANCELLED", "DELIVERED", "SHIPPED"];
    if (status && !validStatus.includes(status)) {
        throw new bad_request_1.BadRequestsException("Invalid status", root_1.ErrorCode.UNPROCESSABLE_ENTITY);
    }
    if (status) {
        whereClause = {
            status: status,
        };
    }
    const orders = yield __1.prismaClient.order.findMany({
        skip: skip,
        take: take,
        orderBy: {
            [sort]: "asc",
        },
        where: Object.assign({ address: {
                contains: filter,
            } }, whereClause),
    });
    const pagedInfo = {
        page: page,
        limit: limit,
        hasPrevious: page > 1,
        hasNext: orders.length == limit,
        totalCount: orders.length,
    };
    return (0, successresponse_1.successResponse)(res, { orders, pagedInfo }, "Orders fetched successfully");
});
exports.listAllOrders = listAllOrders;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const status = req.body.status;
    if (!orderId == null || orderId == "") {
        throw new bad_request_1.BadRequestsException("Order id is required", root_1.ErrorCode.ORDER_ID_REQUIRED);
    }
    if (!status == null || status == "") {
        throw new bad_request_1.BadRequestsException("Status is required", root_1.ErrorCode.UNPROCESSABLE_ENTITY);
    }
    const order = yield __1.prismaClient.order.findFirst({
        where: {
            id: Number(orderId),
        },
    });
    if (!order) {
        throw new not_found_1.NotFoundException("Order not found", root_1.ErrorCode.ORDER_NOT_FOUND);
    }
    yield __1.prismaClient.order.update({
        where: {
            id: Number(orderId),
        },
        data: {
            status: status,
        },
    });
    yield __1.prismaClient.orderEvent.create({
        data: {
            orderId: Number(orderId),
            status: status,
        },
    });
    return (0, successresponse_1.successResponse)(res, null, "Order status updated successfully");
});
exports.changeStatus = changeStatus;
const listUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //list all orders specific to user
    //add pagination, limit and offset, status filter
    let whereClause = {};
    let skip = 0;
    let take = 10;
    let page = 1;
    let limit = 10;
    let sort = "id";
    let filter = "";
    let status = "";
    if (req.query.page) {
        page = Number(req.query.page);
    }
    if (req.query.limit) {
        limit = Number(req.query.limit);
    }
    if (req.query.sort) {
        sort = String(req.query.sort);
    }
    if (req.query.filter) {
        filter = String(req.query.filter);
    }
    //check if status is valid
    if (req.query.status) {
        status = String(req.query.status);
    }
    skip = (page - 1) * limit;
    take = limit;
    //fetch all orders for the user
    const orders = yield __1.prismaClient.order.findMany({
        skip: skip,
        take: take,
        orderBy: {
            [sort]: "asc",
        },
        where: {
            userId: req.user.id,
            address: {
                contains: filter,
            },
        },
    });
    const pagedInfo = {
        page: page,
        limit: limit,
        hasPrevious: page > 1,
        hasNext: orders.length == limit,
        totalCount: orders.length,
    };
    return (0, successresponse_1.successResponse)(res, { orders, pagedInfo }, "Orders fetched successfully");
});
exports.listUserOrders = listUserOrders;
