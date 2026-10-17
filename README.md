# MyMIS Portal

The web frontend for MyMIS, an internal HR / Management Information System. It
talks to two backends:

- [`mymis-api`](https://github.com/snsnusus/mymis-api), the .NET backend, for
  authentication, employees, departments, positions, HMO and location
  reference data.
- [`mymis-chat-service`](https://github.com/snsnusus/mymis-chat-service), a
  Node.js microservice, for real-time chat and online presence.

This project serves a dual purpose: delivering real working software, and
deepening modern frontend and full-stack skills along the way.

**Live:** <https://mymis-portal.vercel.app>

## Tech Stack

| Layer        | Choice                                                  |
| ------------ | ------------------------------------------------------- |
| Framework    | React 18 + TypeScript 5.9, built with Vite 8            |
| UI           | MUI v9 (Material UI)                                    |
| Routing      | React Router v7 (data mode, `createBrowserRouter`)      |
| Server state | TanStack Query v4                                       |
| Client state | Zustand                                                 |
| Forms        | react-hook-form + zod v4                                |
| HTTP         | axios                                                   |
| Real-time    | Native WebSocket to `mymis-chat-service`                |
| Auth         | JWT from `mymis-api`, decoded client-side (`jwt-decode`) |
| Testing      | Vitest + Testing Library + MSW v2 (jsdom)               |
| Components   | Storybook 10                                            |
| Linting      | ESLint (airbnb + prettier)                              |
| CI / Hosting | GitHub Actions / Vercel                                 |

## How it fits in

```
                 ┌──────────────────────────┐
                 │       mymis-portal       │
                 │  (React, this repo)      │
                 └─────┬──────────────┬─────┘
          REST (JWT)   │              │  WebSocket + REST (same JWT)
                       ▼              ▼
          ┌────────────────┐    ┌────────────────────┐
          │   mymis-api    │    │ mymis-chat-service │
          │ (.NET, Azure)  │    │  (Node, AWS ECS)   │
          └───────┬────────┘    └────┬──────────┬────┘
                  ▼                  ▼          ▼
          Supabase Postgres       MongoDB     Redis
                                 (messages) (presence)
```

`mymis-api` issues the tokens; the chat service trusts the same tokens, so
there is only one login.

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8; CI runs Node 24.x)
- A running instance of `mymis-api` (see its README for setup)
- Optional: a running `mymis-chat-service` for chat (see its README)
- Optional: Docker, for the OTP server's Redis and for `mymis-chat-service`'s
  local databases

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/snsnusus/mymis-portal.git
   cd mymis-portal
   npm install
   ```

2. Only if you need the OTP server: install its dependencies. `server/` has
   its own `package.json`, separate from the portal's:

   ```bash
   cd server
   npm install
   cd ..
   ```

3. Start `mymis-api` locally, over HTTPS (in the `mymis-api` repo):

   ```bash
   dotnet run --project MyMIS.Api --launch-profile https
   ```

   The first time, trust the local development certificate, otherwise the
   browser blocks requests with `ERR_CERT_AUTHORITY_INVALID`:

   ```bash
   dotnet dev-certs https --trust
   ```

4. Optional: start `mymis-chat-service` (in its repo) on port 4000:

   ```bash
   docker compose up -d --wait
   npm run dev
   ```

5. Start the portal:

   ```bash
   npm run dev
   ```

   The portal runs on <http://localhost:3000>. That exact origin is the one
   allowed by `mymis-api`'s CORS configuration (`Cors:AllowedOrigins`) and by
   the chat service's `ALLOWED_ORIGINS` in development, so don't change the
   port without updating both.

### Environment variables

Vite picks the file based on the command: `npm run dev` reads
`.env.development`, `npm run build` reads `.env.production`. Only variables
prefixed with `VITE_` are exposed to browser code, and they are baked in at
**build time** (restart `npm run dev` after changing them). They are typed in
`src/vite-env.d.ts`.

| Variable                                  | Purpose                                     |
| ----------------------------------------- | ------------------------------------------- |
| `VITE_API_BASE_URL`                       | Base URL of `mymis-api`, including `/api`   |
| `VITE_DEFAULT_DEPARTMENT_COVER_IMAGE_URL` | Fallback cover image for departments        |
| `VITE_CHAT_WS_URL`                        | WebSocket URL of `mymis-chat-service`       |
| `VITE_CHAT_API_URL`                       | REST URL of `mymis-chat-service`            |

- Locally: `VITE_API_BASE_URL=https://localhost:7129/api`,
  `VITE_CHAT_WS_URL=ws://localhost:4000`, `VITE_CHAT_API_URL=http://localhost:4000`.
- Production uses `https://` / `wss://` URLs (an HTTPS page can't open
  `ws://` or `http://` connections).
- **Chat is a feature flag:** `isChatEnabled` (`src/config/chat.config.ts`) is
  true only when both chat URLs are set. Leave them unset and the portal runs
  without chat.

## The Backends This App Talks To

Each backend has its own axios instance in `src/api/client.ts`:

| Client          | Service                         | Where (local)            | Used for                                                    |
| --------------- | ------------------------------- | ------------------------ | ----------------------------------------------------------- |
| `apiClient`     | `mymis-api`                     | `https://localhost:7129` | Auth, employees, departments, positions, HMO, locations      |
| `chatClient`    | `mymis-chat-service` (REST)     | `http://localhost:4000`  | Conversation list and message history                       |
| WebSocket       | `mymis-chat-service`            | `ws://localhost:4000`    | Live messages and presence (`src/contexts/websocket.context.tsx`) |
| `otpClient`     | Node OTP server (`server/`)     | `http://localhost:4100`  | Contact OTP only, until OTP is rebuilt in `mymis-api`        |
| `mockClient`    | `json-server` (mock)            | `http://localhost:3001`  | Leftover legacy calls (being retired)                       |
| `refreshClient` | `mymis-api`                     | same as `apiClient`      | Token refresh only (no interceptors)                        |

The portal is finishing a migration from `json-server` to the real API. Only a
few calls still use `mockClient` (a department positions helper and the
"change department" bulk update). Once nothing imports it, `json-server` and
`mock-data/` can be deleted.

For everyday work, only `mymis-api` is required. Start the chat service for
chat, the OTP server (plus Redis) for contact OTP, and `json-server` for the
remaining legacy screens.

## Scripts

| Command                   | What it does                                                    |
| ------------------------- | --------------------------------------------------------------- |
| `npm run dev`             | Start the Vite dev server on port 3000                          |
| `npm run build`           | Type-check with `tsc`, then produce a production build          |
| `npm run preview`         | Serve the production build locally                              |
| `npm test`                | Run the test suite once                                         |
| `npm run test:watch`      | Run tests in watch mode                                         |
| `npm run lint`            | Lint `src/` with ESLint                                         |
| `npm run storybook`       | Start Storybook on port 6006                                    |
| `npm run build-storybook` | Build a static Storybook into `storybook-static/`               |
| `npm run mock-db`         | Start `json-server` on port 3001, serving `mock-data/db.json`   |
| `npm run server`          | Start the OTP server on port 4100                               |
| `npm run redis:start`     | Start (or create) a `my-redis` Docker container on port 6379    |
| `npm run dev:all`         | Run the portal, OTP server, `json-server` and Redis together    |

> `redis:start` uses `2>nul`, a Windows shell redirect. On macOS or Linux, run
> the `docker start my-redis || docker run --name my-redis -p 6379:6379 -d redis`
> part yourself. Chat does **not** need this Redis; `mymis-chat-service` runs
> its own.

## Project Structure

```
mymis-portal/
├── .github/workflows/     ← CI (build.yml)
├── .storybook/            ← Storybook config (MUI theme decorator, autodocs)
├── mock-data/db.json      ← json-server data (being retired)
├── server/                ← Node OTP server (temporary); own package.json
├── src/
│   ├── api/               ← axios instances, interceptors, token refresh
│   ├── components/        ← shared UI and form components (+ *.stories.tsx)
│   ├── config/            ← app config (sidebar menu, chat feature flag)
│   ├── contexts/          ← React contexts (auth, websocket)
│   ├── hooks/             ← custom hooks (breadcrumbs, pagination, debounce)
│   ├── layout/            ← app shell: sidebar, navbar, chat dock
│   ├── mappers/           ← API ↔ form-value conversions (<feature>.mapper.ts)
│   ├── mocks/             ← MSW server and handlers (tests)
│   ├── models/            ← TypeScript types for API data (<feature>.model.ts)
│   ├── pages/             ← route-level screens; each feature has routes.tsx
│   ├── queries/           ← TanStack Query hooks (<feature>.query.ts)
│   ├── routes/            ← root router, ProtectedRoute, error route
│   ├── schema/            ← zod schemas for forms
│   ├── services/          ← functions that call the APIs (<feature>.service.ts)
│   ├── stores/            ← Zustand stores (e.g. chat dock)
│   ├── test/              ← Vitest setup
│   └── utils/             ← pure helper functions
├── vercel.json            ← SPA rewrite for Vercel
├── .env.development
└── .env.production
```

Data flows in one direction: a **page or component** calls a **query hook**
(`src/queries`), which calls a **service** (`src/services`), which uses an
axios client (`src/api/client.ts`). Types for the data live in `src/models`;
conversions between API shapes and form values live in `src/mappers`.

### Routing

The root router (`src/routes/index.tsx`) holds the cross-cutting pieces:
`ProtectedRoute`, the error route, the `*` catch-all and `/login`. Each nested
feature exports one `RouteObject` from `src/pages/<feature>/routes.tsx`
(employees, departments, hmo-providers, locations). Route `handle`s carry
breadcrumb labels as `{ crumb, linkable }`.

## Authentication

- Login calls `POST /Auth/login` and receives an access token and a refresh
  token. Both are stored in `localStorage`. This is deliberate: the API's
  `/refresh` and `/logout` endpoints expect the refresh token in the JSON body,
  which rules out httpOnly cookies without backend changes.
- `attachAuthInterceptors(instance)` is applied to both `apiClient` and
  `chatClient`. It attaches the access token to every call, and on a `401` it
  refreshes the token once and retries the request against the same service.
- `refreshAccessToken()` is **single-flight**: concurrent callers (several
  `401`s, or a `401` plus a WebSocket token-expired close) share one in-flight
  refresh. This matters because `mymis-api` rotates refresh tokens and treats
  reuse as theft. The refresh itself uses the interceptor-free
  `refreshClient`, so a failed refresh can't loop. If it fails, the tokens are
  cleared, open chats are closed and the user is sent to `/login`.
- On page load, `AuthProvider` checks the stored access token. A valid token
  restores the session immediately; an expired one triggers a silent refresh
  first. `ProtectedRoute` shows a progress bar until that check finishes.

## Chat

- One WebSocket per tab, owned by `WebSocketProvider`. After connecting it
  sends `AUTH` with the access token; the service answers `AUTH_OK`, then
  presence and live messages flow.
- When the token expires the service closes the socket (code `4002`); the
  portal refreshes the token and reconnects. Other drops reconnect with
  exponential backoff and jitter.
- The navbar chat menu lists your conversations (newest first) and has a
  people search to start a new chat. Up to 2 chat windows open at the bottom
  right; minimized chats become avatar bubbles. Open chats survive a refresh
  (Zustand store persisted to `sessionStorage`).
- Message history is loaded from the chat service's REST endpoint with cursor
  paging ("Load older messages").
- The portal keeps its own copy of the chat wire types in
  `src/models/chat.model.ts`; update it when the service's protocol changes.

## Testing

```bash
npm test
```

Tests run with Vitest in a jsdom environment. Network calls are mocked with MSW
v2 (`src/mocks`). Coverage focuses on pure utility functions, mappers and
selected components.

### Storybook

```bash
npm run storybook
```

Storybook renders components in isolation on <http://localhost:6006>, with the
MUI theme applied globally and an autodocs page per component. Stories live
next to their component (`section-header.stories.tsx` beside
`section-header.tsx`). Providers other than the theme (Query, auth, websocket)
are added per story, so each story shows what its component depends on.

## CI and Deployment

`.github/workflows/build.yml` runs on every pull request to `master`:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm test`

A PR needs all four steps green. The repo works on `master` only, with
short-lived feature branches merged through pull requests.

The portal is deployed on **Vercel** (`mymis-portal.vercel.app`) from `master`.
`vercel.json` rewrites every path to `index.html` so client-side routes work
on refresh. Only the production origin is allowed by the backends' CORS and
origin checks, so Vercel preview deployments can't log in or chat.

## Conventions

- **Conventional Commits** for commit messages (`feat:`, `fix:`, `refactor:`,
  `chore:` ...).
- **Singular role suffixes**: `*.model.ts`, `*.service.ts`, `*.query.ts`,
  `*.mapper.ts`, `*.schema.ts`, `*.store.ts`.
- **Import from the specific file**, not a barrel `index.ts`
  (`~/api/client`, `~/utils/token.util`). The `~/` alias points at `src/`. Some
  barrels still exist and are being phased out.
- **Static assets are imported** (for example
  `import logoLong from '../../../assets/logo-long.png'` in the sidebar) or
  placed in `public/`; plain `/assets/...` paths only work in the dev server.
- **Colors come from the MUI theme palette**, not hard-coded hex/rgba values.
- **Filters live in the URL.** List pages keep their filters in search params
  (for example `?regionId=1&cityId=5`), so refresh, back and deep links work.
- **The API is the source of truth** for data shapes; the portal maps to it,
  not the other way round.

## Known Limitations

- **Employee Create** isn't submitted to the API yet (the wizard validates but
  doesn't save), and the avatar upload UI isn't wired to the API's S3 avatar
  endpoints yet.
- **Profile** shows placeholder data and isn't connected to the API.
- **Offices** has a route but the page is still a placeholder.
- **Delete** actions in the location tables are disabled until a confirmation
  dialog exists.
- The **Department create** flow is disabled pending the Scopes module.
- A few legacy `json-server` calls remain (see above), and some legacy
  `user.*` files and `/users` labels are pending rename to `employee.*`.
- The chat people search returns at most 50 employees; there are no unread
  counts yet.
- `@typescript-eslint` v5 is pinned for `eslint-config-airbnb-typescript`
  compatibility (an archived package) and prints a TypeScript version warning
  on lint. It is harmless; a move to ESLint flat config is planned.
