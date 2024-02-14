"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.me = exports.login = exports.signup = void 0;
const __1 = require("..");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const root_1 = require("../exceptions/root");
const bad_request_1 = require("../exceptions/bad-request");
const user_1 = require("../schema/user");
const not_found_1 = require("../exceptions/not-found");
const emailsender_1 = require("../utils/emailsender");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.SignUpSchema.parse(req.body);
    const { email, name, password } = req.body;
    let user = yield __1.prismaClient.user.findFirst({
        where: {
            email,
        },
    });
    try {
        if ((user === null || user === void 0 ? void 0 : user.email) === email) {
            // throw new Error("User already exists!");
            new bad_request_1.BadRequestsException("User already exists!", root_1.ErrorCode.USER_ALREADY_EXISTS);
        }
        user = yield __1.prismaClient.user.create({
            data: {
                email,
                name,
                password: (0, bcrypt_1.hashSync)(password, 10),
            },
        });
    }
    catch (err) {
        throw new bad_request_1.BadRequestsException("User already exists!", root_1.ErrorCode.USER_ALREADY_EXISTS);
    }
    yield (0, emailsender_1.sendEmail)({
        email: user.email,
        subject: "Welcome to our app",
        message: `Welcome to our app, ${user.name}, we are glad to have you!, you can now login to our app with your email and password.`,
    });
    return res.json(user);
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.LoginSchema.parse(req.body);
    const { email, password } = req.body;
    let user = yield __1.prismaClient.user.findFirst({
        where: {
            email,
        },
    });
    if (!user) {
        throw new not_found_1.NotFoundException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
    const isPasswordValid = (0, bcrypt_1.compareSync)(password, user.password);
    if (!isPasswordValid) {
        throw new bad_request_1.BadRequestsException("Invalid password", root_1.ErrorCode.INVALID_PASSWORD);
    }
    const token = jwt.sign({
        userId: user.id,
        email: user.email,
    }, secrets_1.JWT_SECRET, {
        expiresIn: secrets_1.JWT_EXPIRATION,
    });
    return res.json({ user, token });
});
exports.login = login;
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json(req === null || req === void 0 ? void 0 : req.user);
});
exports.me = me;
