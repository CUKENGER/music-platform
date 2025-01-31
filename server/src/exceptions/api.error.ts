type ErrorType = {
  field: string[];
  messages: string[];
};

export class ApiError extends Error {
  status: number;
  errors: ErrorType[];

  constructor(status: number, message: string, errors: ErrorType[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(message?: string) {
    return new ApiError(401, 'User is not auth', message ? [{ field: [], messages: [message] }] : []);
  }

  static BadRequest(message: string, errors: ErrorType[] = []) {
    return new ApiError(400, message, errors);
  }

  static InternalServerError(message: string, errors: ErrorType[] = []) {
    return new ApiError(500, message, errors)
  }
}
