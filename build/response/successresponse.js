"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = void 0;
const successResponse = (res, data, message) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
