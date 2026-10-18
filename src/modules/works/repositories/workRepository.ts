import { Prisma, WorkStatus, WorkType } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { CreateWorkDto, UpdateWorkDto } from "../dto/workDtos";

export interface WorkListFilters {
  type?: WorkType;
  status?: WorkStatus;
  limit?: number;
  cursorCreatedAt?: Date;
  cursorId?: string;
}

export function findManyWorks(filters: WorkListFilters) {
  const cursorFilter: Prisma.WorkWhereInput | undefined =
    filters.cursorCreatedAt && filters.cursorId
      ? {
          OR: [
            { createdAt: { lt: filters.cursorCreatedAt } },
            { createdAt: filters.cursorCreatedAt, id: { lt: filters.cursorId } },
          ],
        }
      : undefined;

  const whereClause: Prisma.WorkWhereInput = {
    type: filters.type,
    status: filters.status,
    ...cursorFilter,
  };

  return prismaClient.work.findMany({
    where: whereClause,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: (filters.limit ?? 20) + 1,
  });
}

export function findWorkById(workId: string, status?: WorkStatus) {
  return prismaClient.work.findFirst({
    where: { id: workId, ...(status ? { status } : {}) },
    include: {
      dubbedVersions: { where: { status: WorkStatus.PUBLISHED }, include: { episodes: { orderBy: { episodeNumber: "asc" } } } },
      translatedVersions: { where: { status: WorkStatus.PUBLISHED } },
      scripts: { where: { status: WorkStatus.PUBLISHED } },
    },
  });
}

export function createWork(db: Prisma.TransactionClient, workData: CreateWorkDto) {
  return db.work.create({ data: workData });
}

export function updateWorkById(db: Prisma.TransactionClient, workId: string, workData: UpdateWorkDto) {
  return db.work.update({ where: { id: workId }, data: workData });
}

export function deleteWorkById(db: Prisma.TransactionClient, workId: string) {
  return db.work.delete({ where: { id: workId } });
}
