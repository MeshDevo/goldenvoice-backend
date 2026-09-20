import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { validationError } from "../errors/AppError";

// Validates `request.body` against a Zod schema before it reaches the
// controller. This keeps validation rules declared once, next to the
// DTO they belong to, instead of scattered checks inside controllers
// (Trous principle 38: rely on an established validation library
// instead of hand-writing validation).
export function validateRequestBody(schema: ZodSchema) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const validationResult = schema.safeParse(request.body);

    if (!validationResult.success) {
      const readableMessage = validationResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

      next(validationError(readableMessage));
      return;
    }

    request.body = validationResult.data;
    next();
  };
}
