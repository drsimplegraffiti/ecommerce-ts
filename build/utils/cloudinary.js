"use strict";
// import dotenv from "dotenv";
// import * as cloudinary from "cloudinary";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
// dotenv.config({ path: ".env" });
// export default cloudinary.v2.config({
//   cloud_name: (process.env.CLOUDINARY_NAME as string) ?? "drsimple",
//   api_key: (process.env.CLOUDINARY_API_KEY as string) ?? "934959128785944",
//   api_secret:
//     (process.env.CLOUDINARY_API_SECRET as string) ??
//     "sCnORU-HS1oDaFMuG8EPIvUpKkI",
// });
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
exports.cloudinary = cloudinary;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
