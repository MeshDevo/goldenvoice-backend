import { Router } from "express";
import { authenticateRequest } from "../../../shared/middleware/authenticateRequest";
import { validateRequestBody } from "../../../shared/middleware/validateRequestBody";
import { updateUserProfileSchema } from "../dto/updateUserProfileDto";
import { handleGetOwnProfile, handleUpdateOwnProfile } from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get("/me", authenticateRequest, handleGetOwnProfile);
userRoutes.patch(
  "/me",
  authenticateRequest,
  validateRequestBody(updateUserProfileSchema),
  handleUpdateOwnProfile
);
