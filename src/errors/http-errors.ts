// Base custom error extends native JS error
export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  public readonly statusCode = 400;

  constructor(message = "Bad Request") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;

  constructor(message = "Resource Not Found") {
    super(message);
  }
}

export class AuthenticationError extends AppError {
  public readonly statusCode = 401;

  constructor(message = "Not Authenticated") {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;

  constructor(message = "Forbidden") {
    super(message);
  }
}

export class ClaimError extends AppError {
  public readonly statusCode: number;

  constructor(statusCode: number, code: string, message: string) {
    super(message, code);
    this.statusCode = statusCode;
  }
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;

  constructor(message = "Conflict Occurred") {
    super(message);
  }
}