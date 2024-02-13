export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}


export enum ErrorCode {
  ROLE_ALREADY_SAME = 2000,
  ORDER_ID_REQUIRED = 4000,
  ORDER_ALREADY_CANCELLED = 4001,
  ORDER_NOT_FOUND = 4004,
  CART_EMPTY = 100,
  CART_ITEM_NOT_FOUND = 1000,
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  INVALID_TOKEN = 1004,
  TOKEN_EXPIRED = 4005,
  TOKEN_NOT_FOUND = 4006,
  TOKEN_INVALID = 4007,
  TOKEN_REVOKED = 4008,
  UNPROCESSABLE_ENTITY = 4009,
  INTERNAL_ERROR = 5001,
  INVALID_PASSWORD = 5002,
  UNAUTHORIZED = 5003,
  INTERNAL_EXCEPTION,
  FORBIDDEN = 5004,
  ADDRESS_NOT_FOUND = 6002,

  PRODUCT_NOT_FOUND = 6001,
  ADDRESS_DOES_NOT_BELONG = 6003,
}
