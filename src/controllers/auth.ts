import Express, { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../secrets";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-request";
import { UnprocessableEntity } from "../exceptions/validation";
import { LoginSchema, SignUpSchema, otpSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found";
import { sendEmail } from "../utils/emailsender";
import { geneateOtp } from "../utils/otp.compose";
import bcrypt from "bcrypt";
import { successResponse } from "../response/successresponse";
import EventEmitter from "events";
const emitter = new EventEmitter();

export const signup = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);
  const { email, name, password } = req.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  try {
    if (user?.email === email) {
      // throw new Error("User already exists!");
      new BadRequestsException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }
    user = await prismaClient.user.create({
      data: {
        email,
        name,
        password: hashSync(password, 10),
      },
    });
  } catch (err) {
    throw new BadRequestsException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  let otp = geneateOtp(6);

  await prismaClient.otp.create({
    data: {
      otp: bcrypt.hashSync(otp, 10),
      email: user.email,
    },
  });

  //without event emitter
  // await sendEmail({
  //   email: user.email,
  //   subject: "Welcome to our app",
  //   message: `Welcome to our app, ${user.name}, we are glad to have you!, you can now login to our app with your email and password., your otp is ${otp}`,
  // });

  emitter.emit("send-email", { email: user.email, name: user.name, otp });

  return res.json(user);
};

emitter.on("send-email", async (data: any) => {
  await sendEmail({
    email: data.email,
    subject: "Welcome to our app",
    message: `Welcome to our app, ${data.name}, we are glad to have you!, you can now login to our app with your email and password., your otp is ${data.otp}`,
  });
});

export const login = async (req: Request, res: Response) => {
  LoginSchema.parse(req.body);
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const isPasswordValid = compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestsException(
      "Invalid password",
      ErrorCode.INVALID_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRATION,
    }
  );

  return res.json({ user, token });
};

export const me = async (req: Request, res: Response) => {
  // return res.json(req?.user);
  const user = await prismaClient.user.findFirst({
    where: {
      id: req.user?.userId,
    },
    select: {
      email: true,
      name: true,
      id: true,
      role: true,
    },
    
  });

  return successResponse(res, user, "User details fetched successfully");
};

export const verifyOtp = async (req: Request, res: Response) => {
  otpSchema.parse(req.body);
  const { otp, email } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  //check if the otp exists in the otp table
  const userOtpData = await prismaClient.otp.findFirst({
    where: {
      email,
    },
  });

  if (!userOtpData) {
    throw new NotFoundException("Otp not found", ErrorCode.OTP_NOT_FOUND);
  }

  //compare the otp
  const isOtpValid = compareSync(otp, userOtpData.otp);
  if (!isOtpValid) {
    throw new BadRequestsException("Invalid otp", ErrorCode.INVALID_OTP);
  }

  await prismaClient.user.update({
    where: {
      email,
    },
    data: {
      isVerified: true,
    },
  });

  //delete the otp from the otp table
  await prismaClient.otp.delete({
    where: {
      email,
    },
  });

  return successResponse(res, null, "User verified successfully");
};
