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
exports.sendEmail = void 0;
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const sendEmail = (options, attachment = false) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    try {
        const message = {
            from: `${process.env.FROM_NAME} <${process.env.USER_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.message,
        };
        if (attachment) {
            const pathToAttachment = path.join(__dirname, `../public/files/bookingReceipts/${options.filename}`);
            const attachmentContent = fs
                .readFileSync(pathToAttachment)
                .toString("base64");
            //   message.attachments = [
            //     {
            //       filename: options.filename,
            //       content: attachmentContent,
            //       type: "application/pdf",
            //       disposition: "attachment",
            //     },
            //   ];
            //add attachment to message with the typescript type
        }
        const info = yield transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
        return info;
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.sendEmail = sendEmail;
