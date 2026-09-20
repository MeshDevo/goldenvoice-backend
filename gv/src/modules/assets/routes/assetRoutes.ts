import { Router } from "express";
import { authenticateRequest, requireRole } from "../../../shared/middleware/authenticateRequest";
import { validateRequestBody } from "../../../shared/middleware/validateRequestBody";
import { createAssetSchema, updateAssetSchema } from "../dto/assetDtos";
import { handleCreateAsset, handleDeleteAsset, handleGetAsset, handleUpdateAsset } from "../controllers/assetController";

export const assetRoutes = Router();

assetRoutes.get("/:assetId", authenticateRequest, requireRole("EDITOR", "ADMIN"), handleGetAsset);
assetRoutes.post("/", authenticateRequest, requireRole("EDITOR", "ADMIN"), validateRequestBody(createAssetSchema), handleCreateAsset);
assetRoutes.patch("/:assetId", authenticateRequest, requireRole("EDITOR", "ADMIN"), validateRequestBody(updateAssetSchema), handleUpdateAsset);
assetRoutes.delete("/:assetId", authenticateRequest, requireRole("ADMIN"), handleDeleteAsset);
