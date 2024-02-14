import { Console } from "console";

const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const sendEmail = async (options: any, attachment = false) => {
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
      const pathToAttachment = path.join(
        __dirname,
        `../public/files/bookingReceipts/${options.filename}`
      );
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

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export { sendEmail };
