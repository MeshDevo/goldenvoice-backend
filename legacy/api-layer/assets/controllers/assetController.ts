import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import { addAsset, getAsset, removeAsset, updateAsset } from "../services/assetService";
import { CreateAssetDto, UpdateAssetDto } from "../dto/assetDtos";

function serializeAsset(asset: { sizeBytes: bigint } & Record<string, unknown>) {
  return { ...asset, sizeBytes: asset.sizeBytes.toString() };
}

export const handleGetAsset = asyncHandler(async (request: Request, response: Response) => {
  const asset = await getAsset(request.params.assetId);
  response.status(200).json(serializeAsset(asset as unknown as { sizeBytes: bigint } & Record<string, unknown>));
});

export const handleCreateAsset = asyncHandler(async (request: Request, response: Response) => {
  const asset = await addAsset(request.body as CreateAssetDto, request.authenticatedUser!.id);
  response.status(201).json(serializeAsset(asset as unknown as { sizeBytes: bigint } & Record<string, unknown>));
});

export const handleUpdateAsset = asyncHandler(async (request: Request, response: Response) => {
  const asset = await updateAsset(request.params.assetId, request.body as UpdateAssetDto, request.authenticatedUser!.id);
  response.status(200).json(serializeAsset(asset as unknown as { sizeBytes: bigint } & Record<string, unknown>));
});

export const handleDeleteAsset = asyncHandler(async (request: Request, response: Response) => {
  await removeAsset(request.params.assetId, request.authenticatedUser!.id);
  response.status(204).send();
});
