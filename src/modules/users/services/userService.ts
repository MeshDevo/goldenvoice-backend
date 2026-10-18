import { notFoundError } from "../../../shared/errors/AppError";
import { findUserById, updateUserDisplayName } from "../repositories/userRepository";
import { UpdateUserProfileDto } from "../dto/updateUserProfileDto";

export async function getUserProfileById(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw notFoundError("User", userId);
  }

  return user;
}

export async function updateUserProfile(userId: string, updateData: UpdateUserProfileDto) {
  await getUserProfileById(userId); // Ensures the user exists before attempting the update.
  return updateUserDisplayName(userId, updateData.displayName);
}
