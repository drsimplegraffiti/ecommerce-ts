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
exports.uploadProfilePicture = void 0;
const client_1 = require("@prisma/client");
const bad_request_1 = require("../exceptions/bad-request");
const root_1 = require("../exceptions/root");
const cloudinary_1 = require("../utils/cloudinary");
const prismaClient = new client_1.PrismaClient();
const uploadProfilePicture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const user = yield prismaClient.user.findFirst({
        where: {
            id: Number(id),
        },
    });
    if (!user) {
        throw new bad_request_1.BadRequestsException("User not found", root_1.ErrorCode.USER_NOT_FOUND);
    }
    const file = req.file;
    const path = file.path;
    // check if the user already has a profile picture and destroy from cloudinary
    if (user.profilePicture) {
        const publicId = (_a = user.profilePicture.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
        yield cloudinary_1.cloudinary.uploader.destroy(publicId);
    }
    const result = yield cloudinary_1.cloudinary.uploader.upload(path, {
        folder: "profile",
        public_id: user.id.toString(),
        resource_type: "image",
    });
    const updatedUser = yield prismaClient.user.update({
        where: {
            id: user.id,
        },
        data: {
            profilePicture: result.secure_url,
        },
    });
    res.json({ message: "Profile picture updated", data: updatedUser });
});
exports.uploadProfilePicture = uploadProfilePicture;
