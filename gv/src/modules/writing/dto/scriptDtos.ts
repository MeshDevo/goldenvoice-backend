import { z } from "zod";
import { WorkStatus } from "@prisma/client";

export const createScriptSchema = z.object({
  workId: z.string().uuid("workId must be a valid identifier."),
  writerId: z.string().uuid().optional(),
  title: z.string().min(1, "title is required."),
  content: z.string().optional(),
  status: z.nativeEnum(WorkStatus).optional(),
});

export type CreateScriptDto = z.infer<typeof createScriptSchema>;

export const updateScriptSchema = createScriptSchema.omit({ workId: true }).partial();

export type UpdateScriptDto = z.infer<typeof updateScriptSchema>;
