import { Router } from "express";
import { authenticateRequest, requireRole } from "../../../shared/middleware/authenticateRequest";
import { validateRequestBody } from "../../../shared/middleware/validateRequestBody";
import {
  createTranslatedVersionSchema,
  updateTranslatedVersionSchema,
} from "../dto/translatedDtos";
import {
  handleCreateTranslatedVersion,
  handleDeleteTranslatedVersion,
  handleGetTranslatedVersionById,
  handleListTranslatedVersionsForWork,
  handleUpdateTranslatedVersion,
} from "../controllers/translatedController";

export const translatedRoutes = Router();

translatedRoutes.get("/work/:workId", handleListTranslatedVersionsForWork);
translatedRoutes.get("/:translatedVersionId", handleGetTranslatedVersionById);

translatedRoutes.post(
  "/",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(createTranslatedVersionSchema),
  handleCreateTranslatedVersion
);

translatedRoutes.patch(
  "/:translatedVersionId",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(updateTranslatedVersionSchema),
  handleUpdateTranslatedVersion
);

translatedRoutes.delete(
  "/:translatedVersionId",
  authenticateRequest,
  requireRole("ADMIN"),
  handleDeleteTranslatedVersion
);
