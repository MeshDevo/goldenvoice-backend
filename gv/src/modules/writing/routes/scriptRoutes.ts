import { Router } from "express";
import { authenticateRequest, requireRole } from "../../../shared/middleware/authenticateRequest";
import { validateRequestBody } from "../../../shared/middleware/validateRequestBody";
import { createScriptSchema, updateScriptSchema } from "../dto/scriptDtos";
import {
  handleCreateScript,
  handleDeleteScript,
  handleGetScriptById,
  handleListScriptsForWork,
  handleUpdateScript,
} from "../controllers/scriptController";

export const scriptRoutes = Router();

scriptRoutes.get("/work/:workId", handleListScriptsForWork);
scriptRoutes.get("/:scriptId", handleGetScriptById);

scriptRoutes.post(
  "/",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(createScriptSchema),
  handleCreateScript
);

scriptRoutes.patch(
  "/:scriptId",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(updateScriptSchema),
  handleUpdateScript
);

scriptRoutes.delete(
  "/:scriptId",
  authenticateRequest,
  requireRole("ADMIN"),
  handleDeleteScript
);
