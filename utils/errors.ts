/**
 * Custom error classes for handling specific HTTP error scenarios
 */

export class ForbiddenError extends Error {
  public statusCode = 403;
  public resource?: string;

  constructor(message: string = "You do not have permission to access this resource", resource?: string) {
    super(message);
    this.name = "ForbiddenError";
    this.resource = resource;
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ForbiddenError);
    }
  }
}

export class UnauthorizedError extends Error {
  public statusCode = 401;

  constructor(message: string = "You are not authenticated") {
    super(message);
    this.name = "UnauthorizedError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}

export class NotFoundError extends Error {
  public statusCode = 404;

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

/**
 * Check if an error is a ForbiddenError
 */
export function isForbiddenError(error: unknown): error is ForbiddenError {
  return error instanceof ForbiddenError || 
    (error instanceof Error && error.name === "ForbiddenError");
}

/**
 * Check if an error is an UnauthorizedError
 */
export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError ||
    (error instanceof Error && error.name === "UnauthorizedError");
}
