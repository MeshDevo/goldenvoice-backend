import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { forbiddenError, unauthorizedError } from "../errors/AppError";
import { prismaClient } from "../../database/prismaClient";
import { getJwtSecret } from "../config/environment";

interface AccessTokenPayload {
  userId: string;
}

// Verifies the "Authorization: Bearer <token>" header and attaches the
// decoded user to the request. Authentication logic lives only here,
// not scattered across individual modules (Trous principle: "Auth"
// module responsibility in the architecture doc).
export async function authenticateRequest(
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    next(unauthorizedError("A Bearer token is required to access this resource."));
    return;
  }

  const accessToken = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const decodedPayload = jwt.verify(accessToken, getJwtSecret()) as AccessTokenPayload;
    const user = await prismaClient.user.findUnique({
      where: { id: decodedPayload.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      next(unauthorizedError("The account associated with this access token no longer exists."));
      return;
    }

    // Role is read from the database rather than trusted from the JWT.
    // This means a role change takes effect immediately instead of waiting
    // for an old token to expire.
    request.authenticatedUser = user;
    next();
  } catch {
    next(unauthorizedError("The provided access token is invalid or has expired."));
  }
}

// Restricts a route to specific roles. Used after authenticateRequest.
// Example: router.delete("/:id", authenticateRequest, requireRole("ADMIN"), ...)
export function requireRole(...allowedRoles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const currentUser = request.authenticatedUser;

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      next(forbiddenError("You do not have the required role to perform this action."));
      return;
    }

    next();
  };
}
