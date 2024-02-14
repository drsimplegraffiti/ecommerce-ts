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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRole = exports.getUserSingleById = exports.listUsers = exports.updateUser = exports.updateAddress = exports.listAddresses = exports.deleteAddress = exports.addAddress = void 0;
const user_1 = require("../schema/user");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const successresponse_1 = require("../response/successresponse");
const bad_request_1 = require("../exceptions/bad-request");
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    user_1.AddressSchema.parse(req.body);
    let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const address = yield __1.prismaClient.address.create({
        data: Object.assign(Object.assign({}, req.body), { userId: userId }),
    });
    // res.json(address);
    return (0, successresponse_1.successResponse)(res, address, "Address added successfully");
});
exports.addAddress = addAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    let addressId = req.params.id;
    const address = yield __1.prismaClient.address.findUnique({
        where: {
            id: Number(addressId),
        },
    });
    if (!address || address.userId !== userId) {
        throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
    }
    yield __1.prismaClient.address.delete({
        where: {
            id: Number(addressId),
        },
    });
    res.json({ message: "Address deleted successfully" });
});
exports.deleteAddress = deleteAddress;
const listAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    let userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const addresses = yield __1.prismaClient.address.findMany({
        where: {
            userId: userId,
        },
    });
    return (0, successresponse_1.successResponse)(res, addresses, "Addresses fetched successfully");
});
exports.listAddresses = listAddresses;
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    user_1.AddressSchema.parse(req.body);
    let userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    let addressId = req.params.id;
    const address = yield __1.prismaClient.address.findUnique({
        where: {
            id: Number(addressId),
        },
    });
    if (!address || address.userId !== userId) {
        throw new not_found_1.NotFoundException("Address not found", root_1.ErrorCode.ADDRESS_NOT_FOUND);
    }
    const updatedAddress = yield __1.prismaClient.address.update({
        where: {
            id: Number(addressId),
        },
        data: Object.assign({}, req.body),
    });
    return (0, successresponse_1.successResponse)(res, updatedAddress, "Address updated successfully");
});
exports.updateAddress = updateAddress;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = user_1.UpdateUserSchema.parse(req.body);
    let shippingAddress;
    let billingAddress;
    console.log(validatedData);
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress,
                },
            });
        }
        catch (error) {
            throw new not_found_1.NotFoundException("Address not found.", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (shippingAddress.userId != req.user.id) {
            throw new bad_request_1.BadRequestsException("Address does not belong to user", root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress,
                },
            });
        }
        catch (error) {
            throw new not_found_1.NotFoundException("Address not found.", root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (billingAddress.userId != req.user.id) {
            throw new bad_request_1.BadRequestsException("Address does not belong to user", root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    const updatedUser = yield __1.prismaClient.user.update({
        where: {
            id: req.user.id,
        },
        data: validatedData,
    });
    res.json(updatedUser);
});
exports.updateUser = updateUser;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //query params: page, limit, sort, filter
        let page = req.query.page ? Number(req.query.page) : 1;
        let limit = req.query.limit ? Number(req.query.limit) : 10;
        let sort = req.query.sort ? String(req.query.sort) : "id";
        let filter = req.query.filter ? String(req.query.filter) : "";
        let skip = (page - 1) * limit;
        const users = yield __1.prismaClient.user.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                [sort]: "asc",
            },
            where: {
                email: {
                    contains: filter,
                },
            },
        });
        const pagedInfo = {
            page: page,
            limit: limit,
            hasPrevious: page > 1,
            hasNext: users.length == limit,
            totalCount: users.length,
        };
        return (0, successresponse_1.successResponse)(res, { pagedInfo, data: users }, "Users fetched successfully");
    }
    catch (error) {
        throw new not_found_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.listUsers = listUsers;
const getUserSingleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield __1.prismaClient.user.findFirst({
            where: {
                id: Number(userId),
            },
            include: {
                addresses: true,
            },
        });
        if (!user) {
            throw new not_found_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
        }
        // Remove the password field from the user object
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return (0, successresponse_1.successResponse)(res, userWithoutPassword, "User fetched successfully");
    }
    catch (error) {
        throw new not_found_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.getUserSingleById = getUserSingleById;
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.changeUserRoleSchema.parse(req.body);
    const userId = req.params.id;
    const role = req.body.role;
    const user = yield __1.prismaClient.user.findFirst({
        where: {
            id: Number(userId),
        },
    });
    if ((user === null || user === void 0 ? void 0 : user.role) === role) {
        throw new bad_request_1.BadRequestsException("Role is already the same", root_1.ErrorCode.ROLE_ALREADY_SAME);
    }
    if (!user) {
        throw new not_found_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
    const updatedUser = yield __1.prismaClient.user.update({
        where: {
            id: Number(userId),
        },
        data: {
            role: role,
        },
    });
    return (0, successresponse_1.successResponse)(res, updatedUser, "User role updated successfully");
});
exports.changeUserRole = changeUserRole;
