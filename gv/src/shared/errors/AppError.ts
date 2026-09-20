// AppError represents an expected, meaningful application error
// (e.g. "work not found", "invalid credentials"). It carries an HTTP
// status code so the error handler middleware knows how to respond.
//
// Throwing AppError instead of generic Error keeps error handling
// explicit and traceable (Trous principle 42: errors should say what
// failed, where, and why).
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Convenience factories for the most common cases, so call sites read
// clearly instead of repeating "new AppError('...', 404)" everywhere.
export function notFoundError(resourceName: string, resourceId: string): AppError {
  return new AppError(`${resourceName} with id "${resourceId}" was not found.`, 404);
}

export function validationError(message: string): AppError {
  return new AppError(message, 400);
}

export function unauthorizedError(message: string = "Authentication is required."): AppError {
  return new AppError(message, 401);
}

export function forbiddenError(message: string = "You do not have permission to perform this action."): AppError {
  return new AppError(message, 403);
}

export function conflictError(message: string): AppError {
  return new AppError(message, 409);
}
