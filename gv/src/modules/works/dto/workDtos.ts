import { z } from "zod";
import { WorkStatus, WorkType } from "@prisma/client";

export const createWorkSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  thumbnailUrl: z.string().url("Thumbnail must be a valid URL.").optional(),
  coverUrl: z.string().url("Cover must be a valid URL.").optional(),
  type: z.nativeEnum(WorkType, { errorMap: () => ({ message: "Invalid work type." }) }),
  status: z.nativeEnum(WorkStatus).optional(),
  releaseDate: z.coerce.date().optional(),
});

export type CreateWorkDto = z.infer<typeof createWorkSchema>;

// All fields optional: a client updating a Work only sends the fields
// that changed.
export const updateWorkSchema = createWorkSchema.partial();

export type UpdateWorkDto = z.infer<typeof updateWorkSchema>;
