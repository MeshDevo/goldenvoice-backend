import { z } from "zod";

// Defines exactly what a client must send to register a new user, and
// what counts as valid. Kept next to the feature it belongs to
// (Trous principle 46: code locality).
export const registerUserSchema = z.object({
  email: z.string().email("A valid email address is required.").transform((value) => value.trim().toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters long."),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
