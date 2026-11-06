import { test, expect } from '../../fixtures/auth.fixture';
import {
  UnauthorizedResponseSchema,
  UserProfileSchema,
} from '../../schemas/auth.schema';

test('Positive Auth Chaining: gets the authenticated user profile', async ({ authToken, authApi }) => {
  const response = await authApi.getProtectedProfile(authToken);

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(UserProfileSchema.safeParse(data).success).toBe(true);
  expect(data.username).toBe('emilys');
});

test('Negative Unauthorized Check: rejects a request without a token', async ({ authApi }) => {
  const response = await authApi.getProfileWithoutToken();

  expect(response.status()).toBe(401);
  expect(response.ok()).toBe(false);
  const data = await response.json();
  expect(UnauthorizedResponseSchema.safeParse(data).success).toBe(true);
  expect(data.message).toBe('Access Token is required');
});
