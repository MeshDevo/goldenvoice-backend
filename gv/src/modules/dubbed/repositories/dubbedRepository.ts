import { Prisma, WorkStatus } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { CreateDubbedVersionDto, CreateEpisodeDto, UpdateDubbedVersionDto } from "../dto/dubbedDtos";

export function findDubbedVersionsByWorkId(workId: string) {
  return prismaClient.dubbedVersion.findMany({
    where: { workId, status: WorkStatus.PUBLISHED },
    include: { episodes: { orderBy: { episodeNumber: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export function findDubbedVersionById(dubbedVersionId: string) {
  return prismaClient.dubbedVersion.findFirst({
    where: { id: dubbedVersionId, status: WorkStatus.PUBLISHED },
    include: { episodes: { orderBy: { episodeNumber: "asc" } } },
  });
}

export function findDubbedVersionForManagement(dubbedVersionId: string) {
  return prismaClient.dubbedVersion.findUnique({ where: { id: dubbedVersionId } });
}

export function createDubbedVersion(dubbedVersionData: CreateDubbedVersionDto) {
  return prismaClient.dubbedVersion.create({ data: dubbedVersionData });
}

export function updateDubbedVersionById(dubbedVersionId: string, dubbedVersionData: UpdateDubbedVersionDto) {
  return prismaClient.dubbedVersion.update({ where: { id: dubbedVersionId }, data: dubbedVersionData });
}

export function deleteDubbedVersionById(dubbedVersionId: string) {
  return prismaClient.dubbedVersion.delete({ where: { id: dubbedVersionId } });
}

export function createEpisode(episodeData: CreateEpisodeDto) {
  return prismaClient.episode.create({ data: episodeData });
}
