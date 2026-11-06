import { z } from 'zod';

export const LoginResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const UserProfileSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UnauthorizedResponseSchema = z.object({
  message: z.string().min(1),
});

export type UnauthorizedResponse = z.infer<typeof UnauthorizedResponseSchema>;
