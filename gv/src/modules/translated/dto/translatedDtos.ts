import { z } from "zod";
import { WorkStatus } from "@prisma/client";

export const createTranslatedVersionSchema = z.object({
  workId: z.string().uuid("workId must be a valid identifier."),
  sourceLanguage: z.string().min(2, "sourceLanguage is required."),
  targetLanguage: z.string().min(2, "targetLanguage is required."),
  translatorId: z.string().uuid().optional(),
  status: z.nativeEnum(WorkStatus).optional(),
});

export type CreateTranslatedVersionDto = z.infer<typeof createTranslatedVersionSchema>;

export const updateTranslatedVersionSchema = createTranslatedVersionSchema
  .omit({ workId: true })
  .partial();

export type UpdateTranslatedVersionDto = z.infer<typeof updateTranslatedVersionSchema>;
