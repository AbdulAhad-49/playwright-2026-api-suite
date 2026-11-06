import { test, expect } from '../../fixtures/posts.fixture';
import {
  EmptyPostResponseSchema,
  PostSchema,
  type CreatePostInput,
  type UpdatePostInput,
} from '../../schemas/post.schema';

test('GET post by ID 1', async ({ postsApi }) => {
  const response = await postsApi.getPostById(1);

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(PostSchema.safeParse(data).success).toBe(true);
  expect(data.id).toBe(1);
});

test('POST creates a new post', async ({ postsApi }) => {
  const payload: CreatePostInput = {
    userId: 1,
    title: 'Portfolio Project #1',
    body: 'Creating a post with the Posts API fixture.',
  };
  const response = await postsApi.createPost(payload);

  expect(response.status()).toBe(201);
  const data = await response.json();
  expect(PostSchema.safeParse(data).success).toBe(true);
  expect(data.title).toBe(payload.title);
});

test('PUT updates post 1', async ({ postsApi }) => {
  const payload: UpdatePostInput = {
    userId: 1,
    title: 'Updated portfolio post',
    body: 'Updated post content.',
  };
  const response = await postsApi.updatePost(1, payload);

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(PostSchema.safeParse(data).success).toBe(true);
  expect(data.id).toBe(1);
  expect(data.title).toBe(payload.title);
});

test('DELETE deletes post 1', async ({ postsApi }) => {
  const response = await postsApi.deletePost(1);

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(EmptyPostResponseSchema.safeParse(data).success).toBe(true);
  expect(data).toEqual({});
});

test('GET returns 404 for a non-existent post', async ({ postsApi }) => {
  const response = await postsApi.getPostById(999999);

  expect(response.status()).toBe(404);
  expect(response.ok()).toBe(false);
  const data = await response.json();
  expect(EmptyPostResponseSchema.safeParse(data).success).toBe(true);
  expect(data).toEqual({});
});
