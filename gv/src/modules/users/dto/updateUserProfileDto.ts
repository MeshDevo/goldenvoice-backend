import { z } from "zod";

export const updateUserProfileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters long."),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
