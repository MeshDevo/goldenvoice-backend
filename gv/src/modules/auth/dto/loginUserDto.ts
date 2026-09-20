import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email("A valid email address is required.").transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
