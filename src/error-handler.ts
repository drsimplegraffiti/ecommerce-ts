import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/bad-request";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestsException(
            "Unprocessable Entity",
            ErrorCode.UNPROCESSABLE_ENTITY,
            error.errors
          );
        } else if (error.code === "LIMIT_FILE_SIZE") {
          exception = new BadRequestsException(
            "File size too large",
            ErrorCode.FILE_TOO_LARGE
          );
        } else {
          exception = new InternalException(
            `Internal Server Error: ${error.message}`,
            error,
            ErrorCode.INTERNAL_ERROR
          );
          console.error(error);
        }
      }
      next(exception);
    }
  };
};
