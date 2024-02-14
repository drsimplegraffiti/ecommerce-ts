"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const root_1 = require("./root");
class ForbiddenException extends root_1.HttpException {
    constructor(message, errorCode) {
        super(message, errorCode, 403, null);
    }
}
exports.ForbiddenException = ForbiddenException;
