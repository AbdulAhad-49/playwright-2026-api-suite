import { test as base, expect, APIResponse } from '@playwright/test';
import { z } from 'zod';
// 1. Strict Contract (AI aur Test dono ke liye guardrail)
interface PostResponse {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// 2. Playwright API Test ({ request } fixture browser open NAHI karta = Super Fast!)
base('Verify API returns valid post data without false pass', async ({ request }) => {

  // Step A: Direct API call (Takes ~100ms instead of 5 seconds in browser)
  const response = await request.get('/posts/1');

  // Step B: Transport Check
  expect(response.status()).toBe(200);

  // Step C: Extract JSON with strict TypeScript Interface
  const data: PostResponse = await response.json();

  // Step D: Business Logic Assertions (Preventing False PASS)
  expect(data.id).toBe(1);
  expect(data.userId).toBe(1);
  expect(data.title.length).toBeGreaterThan(0); // Title khali nahi hona chahiye!
});

base("Verify creating a post with POST request", async ({ request }) => {

  const response = await request.post('/posts',

    { data: { title: 'QA Test Post', body: 'Testing Playwright API', userId: 101 } });

  expect(response.status()).toBe(201);

  const data = await response.json();

  expect(data.title).toBe('QA Test Post');

  expect(data.id).toBeDefined()



})

base("Verify fetching comments with query parameters", async ({ request }) => {
  const response = await request.get("/comments", {
    params: {
      postId: 1
    }
  });
  expect(response.status()).toBe(200);

  const comments = await response.json();
  expect(comments[0].postId).toBe(1);
  expect(comments.length).toBeGreaterThan(0);
})

base('Verify comment schema using Zod', async ({ request }) => {
  const CommentSchema = z.object({
    postId: z.number(),
    id: z.number(),
    name: z.string(),
    email: z.string().email(), // Checks valid email format!
    body: z.string()
  });
  type CommentType = z.infer<typeof CommentSchema>;
  const response = await request.get("/comments/1");
  expect(response.status()).toBe(200);
  const data: CommentType = await response.json();
  expect(CommentSchema.safeParse(data).success).toBe(true);

})

// 1. Waiter ko nayi dish ('commentsApi') sikhayi
const myTest = base.extend<{
  commentsApi: {
    getComment: (id: number) => Promise<APIResponse>
  };

}>

  ({
    commentsApi: async ({ request }, use) => {
      const meriDish = {
        getComment: (id: number) => request.get(`/comments/${id}`),
      };
      // 2. Dish table par rakh di
      await use(meriDish);
    },
  });

// 3. Customer (Test) ne seedha 'commentsApi' mangwa kar chala liya!
myTest('Waiter Fixture Test', async ({ commentsApi }) => {
  const response = await commentsApi.getComment(1);
  expect(response.status()).toBe(200);
});