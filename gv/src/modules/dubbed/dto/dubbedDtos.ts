import { z } from "zod";
import { WorkStatus } from "@prisma/client";

export const createDubbedVersionSchema = z.object({
  workId: z.string().uuid("workId must be a valid identifier."),
  targetLanguage: z.string().min(2, "targetLanguage is required."),
  status: z.nativeEnum(WorkStatus).optional(),
});

export type CreateDubbedVersionDto = z.infer<typeof createDubbedVersionSchema>;

export const updateDubbedVersionSchema = createDubbedVersionSchema
  .omit({ workId: true })
  .partial();

export type UpdateDubbedVersionDto = z.infer<typeof updateDubbedVersionSchema>;

export const createEpisodeSchema = z.object({
  dubbedVersionId: z.string().uuid("dubbedVersionId must be a valid identifier."),
  episodeNumber: z.number().int().positive("episodeNumber must be a positive integer."),
  title: z.string().min(1, "title is required."),
});

export type CreateEpisodeDto = z.infer<typeof createEpisodeSchema>;
