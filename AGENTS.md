# AGENTS.md - 2026 Playwright API Architecture Rules

## Directory Map (Strictly use only these folders)
- /schemas/*.schema.ts : Zod runtime schemas + z.infer types.
- /fixtures/*.fixture.ts : Playwright base.extend custom API fixtures.
- /tests/api/*.spec.ts : Fast API test suites (NO browser usage).

## Strict 2026 Coding Guardrails
1. NO BROWSER FOR APIs: Never use { page }. Always use { request } inside base.extend fixtures.
2. SINGLE SOURCE OF TRUTH: Never write manual TypeScript interface. Define ONLY Zod schema (z.object) and export type X = z.infer<typeof XSchema>.
3. 2026 CUSTOM FIXTURES: Never use OOP classes or 'new' keyword. Expose API methods via base.extend and await use(...).
4. NO FALSE PASSES: Every test MUST assert HTTP status, validate schema via Schema.safeParse(data).success === true, and assert business logic values.
5. RELATIVE URLS: Always use relative paths (e.g. /posts, /posts/1). baseURL is in playwright.config.ts.
