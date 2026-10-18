import { WorkStatus } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { CreateTranslatedVersionDto, UpdateTranslatedVersionDto } from "../dto/translatedDtos";

export function findTranslatedVersionsByWorkId(workId: string) {
  return prismaClient.translatedVersion.findMany({
    where: { workId, status: WorkStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
  });
}

export function findTranslatedVersionById(translatedVersionId: string) {
  return prismaClient.translatedVersion.findFirst({
    where: { id: translatedVersionId, status: WorkStatus.PUBLISHED },
  });
}

export function findTranslatedVersionForManagement(translatedVersionId: string) {
  return prismaClient.translatedVersion.findUnique({ where: { id: translatedVersionId } });
}

export function createTranslatedVersion(data: CreateTranslatedVersionDto) {
  return prismaClient.translatedVersion.create({ data });
}

export function updateTranslatedVersionById(translatedVersionId: string, data: UpdateTranslatedVersionDto) {
  return prismaClient.translatedVersion.update({ where: { id: translatedVersionId }, data });
}

export function deleteTranslatedVersionById(translatedVersionId: string) {
  return prismaClient.translatedVersion.delete({ where: { id: translatedVersionId } });
}
