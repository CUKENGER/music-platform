export class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(message?) {
    return new ApiError(401, 'User is not auth', message);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static InternalServerError(message, errors = []) {
    return new ApiError(500, message, errors)
  }
}
