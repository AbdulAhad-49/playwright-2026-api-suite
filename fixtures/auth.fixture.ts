import { test as base, expect, type APIResponse } from '@playwright/test';
import { LoginResponseSchema } from '../schemas/auth.schema';

export const test = base.extend<{
  authToken: string;
  authApi: {
    getProtectedProfile: (token: string) => Promise<APIResponse>;
    getProfileWithoutToken: () => Promise<APIResponse>;
  };
}>({
  authToken: async ({ request }, use) => {
    const response = await request.post('https://dummyjson.com/auth/login', {
      data: { username: 'emilys', password: 'emilyspass' },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    const result = LoginResponseSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    const body = result.data;
    expect(body.username).toBe('emilys');
    expect(body.accessToken.length).toBeGreaterThan(0);
    await use(body.accessToken);
  },
  authApi: async ({ request }, use) => {
    await use({
      getProtectedProfile: (token) =>
        request.get('https://dummyjson.com/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      getProfileWithoutToken: () => request.get('https://dummyjson.com/auth/me'),
    });
  },
});

export { expect } from '@playwright/test';
