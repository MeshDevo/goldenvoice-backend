import { Prisma } from "@prisma/client";
import { prismaClient } from "../../../database/prismaClient";
import { CreateAssetDto, UpdateAssetDto } from "../dto/assetDtos";

export function findAssetById(assetId: string) {
  return prismaClient.asset.findUnique({ where: { id: assetId } });
}

export function createAsset(data: CreateAssetDto, uploadedById: string, db: Prisma.TransactionClient = prismaClient) {
  return db.asset.create({ data: { ...data, uploadedById } });
}

export function updateAssetById(assetId: string, data: UpdateAssetDto, db: Prisma.TransactionClient = prismaClient) {
  return db.asset.update({ where: { id: assetId }, data });
}

export function deleteAssetById(assetId: string, db: Prisma.TransactionClient = prismaClient) {
  return db.asset.delete({ where: { id: assetId } });
}
