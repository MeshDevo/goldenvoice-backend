import { prismaClient } from "../../../database/prismaClient";
import { AuditAction, WorkStatus, WorkType } from "@prisma/client";
import { notFoundError } from "../../../shared/errors/AppError";
import { writeAuditLog } from "../../../shared/utils/auditLog";
import { makeNextCursor } from "../../../shared/utils/cursorPagination";
import {
  createWork,
  deleteWorkById,
  findManyWorks,
  findWorkById,
  updateWorkById,
  WorkListFilters,
} from "../repositories/workRepository";
import { CreateWorkDto, UpdateWorkDto } from "../dto/workDtos";

export async function listWorks(filters: WorkListFilters) {
  const rows = await findManyWorks({ ...filters, status: WorkStatus.PUBLISHED });
  const limit = filters.limit ?? 20;
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items.at(-1);

  return {
    items,
    nextCursor: hasMore && last ? makeNextCursor(last.createdAt, last.id) : null,
  };
}

export async function getWorkById(workId: string) {
  const work = await findWorkById(workId);
  if (!work) throw notFoundError("Work", workId);
  return work;
}

export async function getPublishedWorkById(workId: string) {
  const work = await findWorkById(workId, WorkStatus.PUBLISHED);
  if (!work) throw notFoundError("Work", workId);
  return work;
}

export async function publishNewWork(workData: CreateWorkDto, actorId: string) {
  return prismaClient.$transaction(async (db) => {
    const work = await createWork(db, { ...workData, status: workData.status ?? WorkStatus.DRAFT });
    await writeAuditLog(db, {
      action: AuditAction.CREATE,
      entityType: "Work",
      entityId: work.id,
      actorId,
      afterData: work,
    });
    return work;
  });
}

export async function updateExistingWork(workId: string, workData: UpdateWorkDto, actorId: string) {
  const existing = await getWorkById(workId);
  return prismaClient.$transaction(async (db) => {
    const updated = await updateWorkById(db, workId, workData);
    await writeAuditLog(db, {
      action: workData.status === WorkStatus.PUBLISHED ? AuditAction.PUBLISH : AuditAction.UPDATE,
      entityType: "Work",
      entityId: workId,
      actorId,
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  });
}

export async function removeWork(workId: string, actorId: string) {
  const existing = await getWorkById(workId);
  await prismaClient.$transaction(async (db) => {
    await deleteWorkById(db, workId);
    await writeAuditLog(db, {
      action: AuditAction.DELETE,
      entityType: "Work",
      entityId: workId,
      actorId,
      beforeData: existing,
    });
  });
}

export { WorkType, WorkStatus };
