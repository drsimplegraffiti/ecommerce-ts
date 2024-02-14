"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, errorCode, statusCode, error) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = error;
    }
}
exports.HttpException = HttpException;
// export enum ErrorCode {
//   INVALID_FILE_UPLOAD = 563,
//   ROLE_ALREADY_SAME = 2000,
//   ORDER_ID_REQUIRED = 4000,
//   ORDER_ALREADY_CANCELLED = 4001,
//   ORDER_NOT_FOUND = 4004,
//   CART_EMPTY = 1009,
//   CART_ITEM_NOT_FOUND = 1000,
//   USER_NOT_FOUND = 1001,
//   USER_ALREADY_EXISTS = 1002,
//   INCORRECT_PASSWORD = 1003,
//   INVALID_TOKEN = 1004,
//   TOKEN_EXPIRED = 4005,
//   TOKEN_NOT_FOUND = 4006,
//   TOKEN_INVALID = 4007,
//   TOKEN_REVOKED = 4008,
//   UNPROCESSABLE_ENTITY = 4009,
//   INTERNAL_ERROR = 5001,
//   INVALID_PASSWORD = 5002,
//   UNAUTHORIZED = 5003,
//   INTERNAL_EXCEPTION,
//   FORBIDDEN = 5004,
//   ADDRESS_NOT_FOUND = 6002,
//   PRODUCT_NOT_FOUND = 6001,
//   ADDRESS_DOES_NOT_BELONG = 6003,
// }
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["FILE_TOO_LARGE"] = 413] = "FILE_TOO_LARGE";
    ErrorCode[ErrorCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorCode[ErrorCode["INVALID_FILE_UPLOAD"] = 400] = "INVALID_FILE_UPLOAD";
    ErrorCode[ErrorCode["ROLE_ALREADY_SAME"] = 400] = "ROLE_ALREADY_SAME";
    ErrorCode[ErrorCode["ORDER_ID_REQUIRED"] = 400] = "ORDER_ID_REQUIRED";
    ErrorCode[ErrorCode["ORDER_ALREADY_CANCELLED"] = 400] = "ORDER_ALREADY_CANCELLED";
    ErrorCode[ErrorCode["ORDER_NOT_FOUND"] = 404] = "ORDER_NOT_FOUND";
    ErrorCode[ErrorCode["CART_EMPTY"] = 400] = "CART_EMPTY";
    ErrorCode[ErrorCode["CART_ITEM_NOT_FOUND"] = 404] = "CART_ITEM_NOT_FOUND";
    ErrorCode[ErrorCode["USER_NOT_FOUND"] = 404] = "USER_NOT_FOUND";
    ErrorCode[ErrorCode["USER_ALREADY_EXISTS"] = 409] = "USER_ALREADY_EXISTS";
    ErrorCode[ErrorCode["INCORRECT_PASSWORD"] = 401] = "INCORRECT_PASSWORD";
    ErrorCode[ErrorCode["INVALID_TOKEN"] = 401] = "INVALID_TOKEN";
    ErrorCode[ErrorCode["TOKEN_EXPIRED"] = 401] = "TOKEN_EXPIRED";
    ErrorCode[ErrorCode["TOKEN_NOT_FOUND"] = 401] = "TOKEN_NOT_FOUND";
    ErrorCode[ErrorCode["TOKEN_INVALID"] = 401] = "TOKEN_INVALID";
    ErrorCode[ErrorCode["TOKEN_REVOKED"] = 401] = "TOKEN_REVOKED";
    ErrorCode[ErrorCode["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    ErrorCode[ErrorCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    // Server-side errors (5xx)
    ErrorCode[ErrorCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    ErrorCode[ErrorCode["INVALID_PASSWORD"] = 500] = "INVALID_PASSWORD";
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorCode[ErrorCode["INTERNAL_EXCEPTION"] = 500] = "INTERNAL_EXCEPTION";
    ErrorCode[ErrorCode["ADDRESS_NOT_FOUND"] = 404] = "ADDRESS_NOT_FOUND";
    ErrorCode[ErrorCode["PRODUCT_NOT_FOUND"] = 404] = "PRODUCT_NOT_FOUND";
    ErrorCode[ErrorCode["ADDRESS_DOES_NOT_BELONG"] = 400] = "ADDRESS_DOES_NOT_BELONG";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
