import { Router } from "express";
import { authenticateRequest, requireRole } from "../../../shared/middleware/authenticateRequest";
import { validateRequestBody } from "../../../shared/middleware/validateRequestBody";
import {
  createDubbedVersionSchema,
  createEpisodeSchema,
  updateDubbedVersionSchema,
} from "../dto/dubbedDtos";
import {
  handleCreateDubbedVersion,
  handleCreateEpisode,
  handleDeleteDubbedVersion,
  handleGetDubbedVersionById,
  handleListDubbedVersionsForWork,
  handleUpdateDubbedVersion,
} from "../controllers/dubbedController";

export const dubbedRoutes = Router();

dubbedRoutes.get("/work/:workId", handleListDubbedVersionsForWork);
dubbedRoutes.get("/:dubbedVersionId", handleGetDubbedVersionById);

dubbedRoutes.post(
  "/",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(createDubbedVersionSchema),
  handleCreateDubbedVersion
);

dubbedRoutes.patch(
  "/:dubbedVersionId",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(updateDubbedVersionSchema),
  handleUpdateDubbedVersion
);

dubbedRoutes.delete(
  "/:dubbedVersionId",
  authenticateRequest,
  requireRole("ADMIN"),
  handleDeleteDubbedVersion
);

dubbedRoutes.post(
  "/episodes",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(createEpisodeSchema),
  handleCreateEpisode
);
