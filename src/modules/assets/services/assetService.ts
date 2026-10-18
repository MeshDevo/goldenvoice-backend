import { prismaClient } from "../../../database/prismaClient";
import { notFoundError, validationError } from "../../../shared/errors/AppError";
import { AuditAction } from "@prisma/client";
import { writeAuditLog } from "../../../shared/utils/auditLog";
import { CreateAssetDto, UpdateAssetDto } from "../dto/assetDtos";
import { createAsset, deleteAssetById, findAssetById, updateAssetById } from "../repositories/assetRepository";

function countParents(data: CreateAssetDto) {
  return [data.workId, data.dubbedVersionId, data.episodeId, data.translatedVersionId, data.scriptId]
    .filter(Boolean).length;
}

export async function addAsset(data: CreateAssetDto, uploadedById: string) {
  if (countParents(data) !== 1) {
    throw validationError("An asset must belong to exactly one content parent.");
  }

  if (data.workId && !(await prismaClient.work.findUnique({ where: { id: data.workId }, select: { id: true } }))) {
    throw notFoundError("Work", data.workId);
  }
  if (data.dubbedVersionId && !(await prismaClient.dubbedVersion.findUnique({ where: { id: data.dubbedVersionId }, select: { id: true } }))) {
    throw notFoundError("Dubbed version", data.dubbedVersionId);
  }
  if (data.episodeId && !(await prismaClient.episode.findUnique({ where: { id: data.episodeId }, select: { id: true } }))) {
    throw notFoundError("Episode", data.episodeId);
  }
  if (data.translatedVersionId && !(await prismaClient.translatedVersion.findUnique({ where: { id: data.translatedVersionId }, select: { id: true } }))) {
    throw notFoundError("Translated version", data.translatedVersionId);
  }
  if (data.scriptId && !(await prismaClient.script.findUnique({ where: { id: data.scriptId }, select: { id: true } }))) {
    throw notFoundError("Script", data.scriptId);
  }

  return prismaClient.$transaction(async (db) => {
    const asset = await createAsset(data, uploadedById, db);
    await writeAuditLog(db, {
      action: AuditAction.CREATE,
      entityType: "Asset",
      entityId: asset.id,
      actorId: uploadedById,
      afterData: asset,
    });
    return asset;
  });
}

export async function getAsset(assetId: string) {
  const asset = await findAssetById(assetId);
  if (!asset) throw notFoundError("Asset", assetId);
  return asset;
}

export async function updateAsset(assetId: string, data: UpdateAssetDto, actorId: string) {
  const existing = await getAsset(assetId);
  return prismaClient.$transaction(async (db) => {
    const updated = await updateAssetById(assetId, data, db);
    await writeAuditLog(db, {
      action: AuditAction.UPDATE,
      entityType: "Asset",
      entityId: assetId,
      actorId,
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  });
}

export async function removeAsset(assetId: string, actorId: string) {
  const existing = await getAsset(assetId);
  await prismaClient.$transaction(async (db) => {
    await deleteAssetById(assetId, db);
    await writeAuditLog(db, {
      action: AuditAction.DELETE,
      entityType: "Asset",
      entityId: assetId,
      actorId,
      beforeData: existing,
    });
  });
}
