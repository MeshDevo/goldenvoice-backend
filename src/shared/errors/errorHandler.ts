import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";

// Central place where every error in the application ends up.
// Controllers never format error responses themselves; they simply
// throw or forward errors (via asyncHandler) and this middleware
// decides how they look to the client.
//
// This keeps error formatting consistent across all modules
// (Trous principle 50: consistency).
export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
    return;
  }

  // An error reaching this branch was not anticipated by application
  // code. We log the full error for debugging but never leak internal
  // details (stack traces, database messages) to the client.
  console.error("Unexpected error:", error);

  response.status(500).json({
    error: {
      message: "An unexpected error occurred. Please try again later.",
    },
  });
}

// Handles requests to routes that do not exist. Registered after all
// module routes in app.ts.
export function notFoundHandler(request: Request, response: Response): void {
  response.status(404).json({
    error: {
      message: `Route ${request.method} ${request.originalUrl} does not exist.`,
    },
  });
}
