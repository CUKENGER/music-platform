// src/exceptions/api.error.ts

import { ERROR_CODES, ErrorCodeType } from 'constants/errorCodes';

type ErrorType = {
  field: string[];
  messages: string[];
};

export class ApiError extends Error {
  status: number;
  errors: ErrorType[];
  code: ErrorCodeType;

  constructor(status: number, message: string, code: ErrorCodeType, errors: ErrorType[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
  }

  static UnauthorizedError(
    message: string = 'Пользователь не авторизован',
    code: ErrorCodeType = ERROR_CODES.UNAUTHORIZED,
  ) {
    return new ApiError(401, message, code);
  }

  static BadRequest(
    message: string,
    code: ErrorCodeType = ERROR_CODES.BAD_REQUEST,
    errors: ErrorType[] = [],
  ) {
    return new ApiError(400, message, code, errors);
  }

  static Forbidden(
    message: string,
    code: ErrorCodeType = ERROR_CODES.FORBIDDEN,
    errors: ErrorType[] = [],
  ) {
    return new ApiError(403, message, code, errors);
  }

  static TooManyRequests(
    message: string,
    code: ErrorCodeType = ERROR_CODES.TOO_MANY_REQUESTS,
    errors: ErrorType[] = [],
  ) {
    return new ApiError(429, message, code, errors);
  }

  static InternalServerError(
    message: string,
    code: ErrorCodeType = ERROR_CODES.INTERNAL_SERVER_ERROR,
    errors: ErrorType[] = [],
  ) {
    return new ApiError(500, message, code, errors);
  }
}
