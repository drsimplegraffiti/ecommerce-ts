import Express, { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../secrets";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-request";
import { UnprocessableEntity } from "../exceptions/validation";
import { LoginSchema, SignUpSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found";
import { sendEmail } from "../utils/emailsender";

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

  await sendEmail({
    email: user.email,
    subject: "Welcome to our app",
    message: `Welcome to our app, ${user.name}, we are glad to have you!, you can now login to our app with your email and password.`,
  });

  return res.json(user);
};

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
  return res.json(req?.user);
};
