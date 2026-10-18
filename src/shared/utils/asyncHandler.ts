import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

// Express does not automatically forward rejected promises to the error
// handler middleware. Wrapping every controller with asyncHandler
// forwards any thrown/rejected error to `next()`, so controllers can
// simply "throw new AppError(...)" without a try/catch block.
//
// This is automation over manual repetition (Trous principle 51): every
// controller would otherwise need an identical try/catch wrapper.
export function asyncHandler(handler: AsyncRequestHandler) {
  return (request: Request, response: Response, next: NextFunction): void => {
    handler(request, response, next).catch(next);
  };
}
