import { z } from "zod";
import { AssetStatus, AssetType } from "@prisma/client";

export const createAssetSchema = z.object({
  fileName: z.string().min(1).max(255),
  storageKey: z.string().min(1).max(1024),
  mimeType: z.string().min(1).max(255),
  sizeBytes: z.coerce.bigint().nonnegative(),
  checksumSha256: z.string().regex(/^[a-fA-F0-9]{64}$/).optional(),
  type: z.nativeEnum(AssetType),
  status: z.nativeEnum(AssetStatus).optional(),
  workId: z.string().uuid().optional(),
  dubbedVersionId: z.string().uuid().optional(),
  episodeId: z.string().uuid().optional(),
  translatedVersionId: z.string().uuid().optional(),
  scriptId: z.string().uuid().optional(),
});

export type CreateAssetDto = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = z.object({
  status: z.nativeEnum(AssetStatus).optional(),
});

export type UpdateAssetDto = z.infer<typeof updateAssetSchema>;
