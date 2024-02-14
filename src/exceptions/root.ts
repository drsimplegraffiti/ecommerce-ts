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


// export enum ErrorCode {
//   INVALID_FILE_UPLOAD = 563,
//   ROLE_ALREADY_SAME = 2000,
//   ORDER_ID_REQUIRED = 4000,
//   ORDER_ALREADY_CANCELLED = 4001,
//   ORDER_NOT_FOUND = 4004,
//   CART_EMPTY = 1009,
//   CART_ITEM_NOT_FOUND = 1000,
//   USER_NOT_FOUND = 1001,
//   USER_ALREADY_EXISTS = 1002,
//   INCORRECT_PASSWORD = 1003,
//   INVALID_TOKEN = 1004,
//   TOKEN_EXPIRED = 4005,
//   TOKEN_NOT_FOUND = 4006,
//   TOKEN_INVALID = 4007,
//   TOKEN_REVOKED = 4008,
//   UNPROCESSABLE_ENTITY = 4009,
//   INTERNAL_ERROR = 5001,
//   INVALID_PASSWORD = 5002,
//   UNAUTHORIZED = 5003,
//   INTERNAL_EXCEPTION,
//   FORBIDDEN = 5004,
//   ADDRESS_NOT_FOUND = 6002,

//   PRODUCT_NOT_FOUND = 6001,
//   ADDRESS_DOES_NOT_BELONG = 6003,
// }

export enum ErrorCode {
  BAD_REQUEST = 400, // Bad Request
  INVALID_FILE_UPLOAD = 400, // Unprocessable Entity
  ROLE_ALREADY_SAME = 400, // Bad Request
  ORDER_ID_REQUIRED = 400, // Bad Request
  ORDER_ALREADY_CANCELLED = 400, // Bad Request
  ORDER_NOT_FOUND = 404, // Not Found
  CART_EMPTY = 400, // Bad Request
  CART_ITEM_NOT_FOUND = 404, // Not Found
  USER_NOT_FOUND = 404, // Not Found
  USER_ALREADY_EXISTS = 409, // Conflict
  INCORRECT_PASSWORD = 401, // Unauthorized
  INVALID_TOKEN = 401, // Unauthorized
  TOKEN_EXPIRED = 401, // Unauthorized
  TOKEN_NOT_FOUND = 401, // Unauthorized
  TOKEN_INVALID = 401, // Unauthorized
  TOKEN_REVOKED = 401, // Unauthorized
  UNPROCESSABLE_ENTITY = 422, // Unprocessable Entity
  FORBIDDEN = 403, // Forbidden

  // Server-side errors (5xx)
  INTERNAL_ERROR = 500, // Internal Server Error
  INVALID_PASSWORD = 500, // Internal Server Error
  UNAUTHORIZED = 401, // Not changed, already maps to "Unauthorized"
  INTERNAL_EXCEPTION = 500, // Internal Server Error
  ADDRESS_NOT_FOUND = 404, // Not Found
  PRODUCT_NOT_FOUND = 404, // Not Found
  ADDRESS_DOES_NOT_BELONG = 400, // Bad Request

}