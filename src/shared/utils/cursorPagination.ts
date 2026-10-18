export interface CursorPage {
  limit: number;
  cursorCreatedAt?: Date;
  cursorId?: string;
}

export function parseCursorPage(rawLimit: unknown, rawCursor: unknown): CursorPage {
  const parsedLimit = Number(rawLimit ?? 20);
  const limit = Number.isInteger(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 20;

  if (typeof rawCursor !== "string" || !rawCursor) {
    return { limit };
  }

  try {
    const decoded = Buffer.from(rawCursor, "base64url").toString("utf8");
    const [createdAt, id] = decoded.split("|");
    const date = new Date(createdAt);

    if (!id || Number.isNaN(date.getTime())) return { limit };
    return { limit, cursorCreatedAt: date, cursorId: id };
  } catch {
    return { limit };
  }
}

export function makeNextCursor(createdAt: Date, id: string): string {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString("base64url");
}
