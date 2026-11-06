# 2026 Enterprise Playwright API & Contract Automation Suite

A QA automation portfolio project demonstrating Posts API CRUD coverage, negative testing, and runtime response contract validation. The suite combines reusable Playwright API fixtures with Zod schemas so tests verify HTTP status, response structure, and business values.

## Tech Stack

| Technology / Practice | Purpose |
| --- | --- |
| Playwright Test | API requests, assertions, parallel execution, and HTML reporting |
| TypeScript | Typed fixture methods and test payloads |
| Zod Runtime Contract Validation | Validate actual JSON responses with `safeParse` |
| 2026 Custom Fixtures via `base.extend` | Expose reusable API methods through the `request` fixture and `await use(...)` |
| Single Source of Truth via `z.infer` | Derive data types from Zod schemas instead of maintaining manual interfaces |
| AI-Agent Guardrails via `AGENTS.md` | Define architecture, assertion requirements, and implementation conventions |

## Project Architecture

```text
.
├── schemas/
│   └── post.schema.ts       # Response and input schemas; inferred types
├── fixtures/
│   └── posts.fixture.ts     # postsApi: GET, POST, PUT, DELETE
├── tests/
│   └── api/
│       └── posts.spec.ts    # CRUD and negative API tests
├── AGENTS.md               # Architecture and coding guardrails
├── playwright.config.ts    # Shared baseURL, projects, and reporting
├── package.json
├── package-lock.json
└── .gitignore
```

The tree highlights the portfolio module and its supporting configuration. Schemas live in `/schemas`, API operations in `/fixtures`, and API test suites in `/tests/api`.

Tests consume `{ postsApi }`; the custom fixture uses `{ request }` with relative endpoint paths. API operations require no browser instance. The API host is configured once through `baseURL` in `playwright.config.ts`.

## Test Coverage

| Scenario | Endpoint | Expected status | Contract and business assertions |
| --- | --- | --- | --- |
| Read a post | `GET /posts/1` | `200` | `PostSchema`; ID equals `1` |
| Create a post | `POST /posts` | `201` | `PostSchema`; title matches the payload |
| Update a post | `PUT /posts/1` | `200` | `PostSchema`; ID and updated title match |
| Delete a post | `DELETE /posts/1` | `200` | Strict empty-object schema; body equals `{}` |
| Request a missing post | `GET /posts/999999` | `404` | Strict empty-object schema; body equals `{}` and `response.ok()` is `false` |

Every portfolio test checks HTTP status, validates the response with `Schema.safeParse(data).success`, and asserts expected values. The target API is JSONPlaceholder at `https://jsonplaceholder.typicode.com`; these tests require network access to that host.

## Install and Run

Prerequisites: Node.js with npm and a terminal opened at the repository root.

Install the dependencies recorded in the lockfile:

```bash
npm ci
```

Run the portfolio API suite once using the configured Chromium project:

```bash
npx playwright test tests/api --project=chromium
```

The project name selects a Playwright configuration. These tests use API requests only, so browser installation is unnecessary for this suite.

Run only the Posts module with terminal output:

```bash
npx playwright test tests/api/posts.spec.ts --project=chromium --reporter=list
```

Run the API suite across all configured projects:

```bash
npx playwright test tests/api
```

The current configuration defines Chromium, Firefox, and WebKit projects, so this command executes the same five API tests three times.

Open the HTML report after a run using the default HTML reporter:

```bash
npx playwright show-report
```

## Repository Hygiene

`.gitignore` excludes dependencies, generated test results and reports, Playwright cache and authentication state, and the local `.env` file. Commit source files and `package-lock.json` so dependency installation is reproducible.
