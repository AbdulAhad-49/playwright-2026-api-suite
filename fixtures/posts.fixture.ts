import { test as base, type APIResponse } from '@playwright/test';
import type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema';

export const test = base.extend<{
  postsApi: {
    getPostById: (id: number) => Promise<APIResponse>;
    createPost: (payload: CreatePostInput) => Promise<APIResponse>;
    updatePost: (id: number, payload: UpdatePostInput) => Promise<APIResponse>;
    deletePost: (id: number) => Promise<APIResponse>;
  };
}>({
  postsApi: async ({ request }, use) => {
    await use({
      getPostById: (id) => request.get(`/posts/${id}`),
      createPost: (payload) => request.post('/posts', { data: payload }),
      updatePost: (id, payload) => request.put(`/posts/${id}`, { data: payload }),
      deletePost: (id) => request.delete(`/posts/${id}`),
    });
  },
});

export { expect } from '@playwright/test';
