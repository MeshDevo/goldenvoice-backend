import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import { unauthorizedError } from "../../../shared/errors/AppError";
import { getUserProfileById, updateUserProfile } from "../services/userService";
import { UpdateUserProfileDto } from "../dto/updateUserProfileDto";

// Reads the currently authenticated user's own profile.
export const handleGetOwnProfile = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.authenticatedUser) {
      throw unauthorizedError();
    }

    const userProfile = await getUserProfileById(request.authenticatedUser.id);
    response.status(200).json(userProfile);
  }
);

export const handleUpdateOwnProfile = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.authenticatedUser) {
      throw unauthorizedError();
    }

    const updatedProfile = await updateUserProfile(
      request.authenticatedUser.id,
      request.body as UpdateUserProfileDto
    );

    response.status(200).json(updatedProfile);
  }
);
