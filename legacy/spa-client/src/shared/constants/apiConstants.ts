// Unified codebase: the server mounts every module under /api/v1
// (see server/src/app/app.ts, in this same repository).
// The client calls a RELATIVE base URL by default — in development Vite
// proxies it to the server, in production the server serves this client
// itself. No separate API host, no localhost hardcoding, no CORS setup.
// Set VITE_API_BASE_URL only to deliberately point at another origin.
// Mirrors Prisma enums and models from server/prisma/schema.prisma

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export const DEFAULT_PAGE_SIZE = 20;

// Mirrors WorkStatus enum from backend
export const WORK_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

// Mirrors WorkType enum from backend
export const WORK_TYPE_ENUM = {
  ANIME: "ANIME",
  GAME: "GAME",
  ENTERTAINMENT: "ENTERTAINMENT",
  DRAMA: "DRAMA",
  EDUCATION: "EDUCATION",
  ORIGINAL: "ORIGINAL",
} as const;

// Mirrors UserRole enum from backend
export const USER_ROLE = {
  VISITOR: "VISITOR",
  MEMBER: "MEMBER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
} as const;
