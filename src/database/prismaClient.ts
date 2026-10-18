import { PrismaClient } from "@prisma/client";

// A single, shared PrismaClient instance for the whole application.
// Repositories import this instead of creating their own client, which
// keeps database access centralized (architecture doc, section 20:
// "Database access should be centralized and structured").
export const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
