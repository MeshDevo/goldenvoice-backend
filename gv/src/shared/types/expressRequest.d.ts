import { UserRole } from "@prisma/client";

// Describes the minimal, non-sensitive information about the
// authenticated user that request handlers are allowed to rely on.
// Never attach the password hash or other sensitive fields here.
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

export {};
