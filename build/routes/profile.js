"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../error-handler");
const auth_1 = __importDefault(require("../middlewares/auth"));
const test_1 = require("../controllers/test");
const admin_1 = __importDefault(require("../middlewares/admin"));
const express_1 = require("express");
const multer_1 = require("../utils/multer");
const profileRoutes = (0, express_1.Router)();
profileRoutes.post("/picture/:id", multer_1.upload.single("image"), [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(test_1.uploadProfilePicture));
exports.default = profileRoutes;
