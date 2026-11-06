import { z } from 'zod';

export const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof PostSchema>;

export const CreatePostInputSchema = PostSchema.omit({ id: true });

export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export const UpdatePostInputSchema = PostSchema.omit({ id: true });

export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>;

export const EmptyPostResponseSchema = z.object({}).strict();

export type EmptyPostResponse = z.infer<typeof EmptyPostResponseSchema>;
