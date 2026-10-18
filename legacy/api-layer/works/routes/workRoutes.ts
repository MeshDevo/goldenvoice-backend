import { Router } from "express";
import { authenticateRequest, requireRole } from "../../../shared/middleware/authenticateRequest";
import { validateRequestBody } from "../../../shared/middleware/validateRequestBody";
import { createWorkSchema, updateWorkSchema } from "../dto/workDtos";
import {
  handleCreateWork,
  handleDeleteWork,
  handleGetWorkById,
  handleListWorks,
  handleUpdateWork,
} from "../controllers/workController";

export const workRoutes = Router();

// Public read access: anyone can browse and view works.
workRoutes.get("/", handleListWorks);
workRoutes.get("/:workId", handleGetWorkById);

// Write access is restricted to editors and admins.
workRoutes.post(
  "/",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(createWorkSchema),
  handleCreateWork
);

workRoutes.patch(
  "/:workId",
  authenticateRequest,
  requireRole("EDITOR", "ADMIN"),
  validateRequestBody(updateWorkSchema),
  handleUpdateWork
);

workRoutes.delete(
  "/:workId",
  authenticateRequest,
  requireRole("ADMIN"),
  handleDeleteWork
);
