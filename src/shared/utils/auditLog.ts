import { AuditAction, Prisma } from "@prisma/client";

function toJsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) return undefined;
  return JSON.parse(
    JSON.stringify(value, (_key, nestedValue) => {
      if (nestedValue instanceof Date) return nestedValue.toISOString();
      if (typeof nestedValue === "bigint") return nestedValue.toString();
      return nestedValue;
    })
  ) as Prisma.InputJsonValue;
}

export async function writeAuditLog(
  db: Prisma.TransactionClient,
  input: {
    action: AuditAction;
    entityType: string;
    entityId: string;
    actorId?: string;
    beforeData?: unknown;
    afterData?: unknown;
  }
) {
  return db.auditLog.create({
    data: {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      actorId: input.actorId,
      beforeData: toJsonValue(input.beforeData),
      afterData: toJsonValue(input.afterData),
    },
  });
}
