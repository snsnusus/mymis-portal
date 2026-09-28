# MyMIS Portal

The web frontend for MyMIS, an internal HR / Management Information System. It
talks to [`mymis-api`](https://github.com/snsnusus/mymis-api), the .NET
backend, for authentication, employees and location reference data.

This project serves a dual purpose: delivering real working software, and
deepening modern frontend and full-stack skills along the way.

## Tech Stack

| Layer        | Choice                                             |
| ------------ | -------------------------------------------------- |
| Framework    | React 18 + TypeScript, built with Vite             |
| UI           | MUI (Material UI)                                  |
| Routing      | React Router v7 (data mode, `createBrowserRouter`) |
| Server state | TanStack Query v4                                  |
| Client state | Zustand                                            |
| Forms        | react-hook-form + zod                              |
| HTTP         | axios                                              |
| Auth         | JWT decoded client-side with `jwt-decode`          |
| Testing      | Vitest + Testing Library + MSW v2 (jsdom)          |
| Linting      | ESLint (airbnb + prettier)                         |
| CI           | GitHub Actions                                     |

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8; CI runs Node 24.x)
- A running instance of `mymis-api` (see its README for setup)
- Docker, only if you want to run the real-time chat server (it needs Redis)

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/snsnusus/mymis-portal.git
   cd mymis-portal
   npm install
   ```

2. Install the chat server's dependencies. `server/` has its own
   `package.json`, separate from the portal's:

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

4. Start the portal:

   ```bash
   npm run dev
   ```

   The portal runs on <http://localhost:3000>. That exact origin is the one the
   API's CORS configuration allows in Development, so don't change the port
   without updating the API's `Cors:AllowedOrigins` too.

### Environment variables

Vite picks the file based on the command: `npm run dev` reads
`.env.development`, `npm run build` reads `.env.production`. Only variables
prefixed with `VITE_` are exposed to browser code.

| Variable                                  | Purpose                                   |
| ----------------------------------------- | ----------------------------------------- |
| `VITE_API_BASE_URL`                       | Base URL of `mymis-api`, including `/api` |
| `VITE_DEFAULT_DEPARTMENT_COVER_IMAGE_URL` | Fallback cover image for departments      |

Locally, `VITE_API_BASE_URL` points at `https://localhost:7129/api`. In
production it points at the deployed API.

## The Backends This App Talks To

The portal is mid-migration from a fake backend to the real one, so during
development it can talk to up to four things:

| Service                 | Where                    | Used for                                                                         |
| ----------------------- | ------------------------ | -------------------------------------------------------------------------------- |
| `mymis-api` (real)      | `https://localhost:7129` | Auth, employees, regions / cities / barangays                                    |
| `json-server` (mock)    | `http://localhost:3001`  | Departments, the chat user directory, and anything else still using `mockClient` |
| Node + WebSocket server | `http://localhost:4000`  | Real-time presence and contact OTP (`server/server.js`)                          |
| Redis                   | `localhost:6379`         | Backs the presence server                                                        |

Each has its own axios instance in `src/api/client.ts`: `apiClient` (real API),
`mockClient` (json-server), `nodeClient` (Node server). As modules move to
`mymis-api`, they switch from `mockClient` to `apiClient`, and `json-server`
gets smaller. Once nothing imports `mockClient`, `json-server` and
`mock-data/` can be deleted.

You only need `json-server`, the Node server and Redis for the screens that
still depend on them. Employees, locations and login work with just
`mymis-api` running.

## Scripts

| Command               | What it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `npm run dev`         | Start the Vite dev server on port 3000                        |
| `npm run build`       | Type-check with `tsc`, then produce a production build        |
| `npm run preview`     | Serve the production build locally                            |
| `npm test`            | Run the test suite once                                       |
| `npm run test:watch`  | Run tests in watch mode                                       |
| `npm run lint`        | Lint `src/` with ESLint                                       |
| `npm run mock-db`     | Start `json-server` on port 3001, serving `mock-data/db.json` |
| `npm run server`      | Start the Node + WebSocket server on port 4000                |
| `npm run redis:start` | Start (or create) a `my-redis` Docker container on port 6379  |
| `npm run dev:all`     | Run the portal, Node server, `json-server` and Redis together |

> `redis:start` uses `2>nul`, a Windows shell redirect. On macOS or Linux, run
> the `docker start my-redis || docker run --name my-redis -p 6379:6379 -d redis`
> part yourself.

## Project Structure

```
mymis-portal/
├── .github/workflows/     ← CI (build.yml)
├── mock-data/db.json      ← json-server data (being retired)
├── server/                ← Node + WebSocket server (presence, OTP); own package.json
├── src/
│   ├── api/               ← axios instances and interceptors
│   ├── components/        ← shared UI and form components
│   ├── contexts/          ← React contexts (auth, websocket)
│   ├── hooks/             ← TanStack Query hooks and other custom hooks
│   ├── layout/            ← app shell: sidebar, topbar, breadcrumbs
│   ├── mocks/             ← MSW server and handlers (tests)
│   ├── models/            ← TypeScript types for API data and forms
│   ├── pages/             ← route-level screens
│   ├── routes/            ← router config and ProtectedRoute
│   ├── services/          ← functions that call the API
│   ├── test/              ← Vitest setup
│   └── utils/             ← pure helper functions
├── .env.development
└── .env.production
```

Data flows in one direction: a **page or component** calls a **hook**
(`src/hooks`), which calls a **service** (`src/services`), which uses an axios
client (`src/api/client.ts`). Types for the data live in `src/models`.

## Authentication

- Login calls `POST /Auth/login` and receives an access token and a refresh
  token. Both are stored in `localStorage`. This is deliberate: the API's
  `/refresh` and `/logout` endpoints expect the refresh token in the JSON body,
  which rules out httpOnly cookies without backend changes.
- A request interceptor on `apiClient` attaches the access token to every
  call.
- A response interceptor handles `401`s: it refreshes the tokens once (using a
  separate, interceptor-free `refreshClient` to avoid a refresh loop), retries
  the original request, and queues any other requests that fail meanwhile. If
  the refresh fails, it clears the tokens and redirects to `/login`.
- On page load, `AuthProvider` checks the stored access token. A valid token
  restores the session immediately; an expired one triggers a silent refresh
  before deciding whether the user is logged in. `ProtectedRoute` shows a
  progress bar until that check finishes, so a refresh in flight never causes a
  premature redirect.

## Testing

```bash
npm test
```

Tests run with Vitest in a jsdom environment. Network calls are mocked with MSW
v2 (`src/mocks`). Coverage is currently focused on pure utility functions;
component and integration tests are still to come.

## CI

`.github/workflows/build.yml` runs on every pull request to `master`:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm test`

A PR needs all four steps green. The repo works on `master` only, with
short-lived feature branches merged through pull requests.

## Conventions

- **Conventional Commits** for commit messages (`feat:`, `fix:`, `refactor:`,
  `chore:` ...).
- **Import from the specific file**, not a barrel `index.ts`
  (`~/api/client`, `~/utils/token.util`). The `~/` alias points at `src/`. Some
  barrels still exist and are being phased out.
- **Model file suffixes** follow the convention documented in
  `src/models/README.md`.
- **Filters live in the URL.** List pages keep their filters in search params
  (for example `?regionId=1&cityId=5`), so refresh, back and deep links work.

## Known Limitations

- `json-server` still backs Departments and the chat user directory, so those
  screens need `npm run mock-db` running.
- Employee lists are not paginated on the backend yet.
- The user-facing avatar upload UI is not wired to the API's S3 avatar
  endpoints yet.
- Some legacy `user.*` files and `/users` route labels are pending rename to
  `employee.*` / `/employees`.
- `@typescript-eslint` v5 is pinned for `eslint-config-airbnb-typescript`
  compatibility and prints a TypeScript version warning on lint. It is
  harmless; lint runs clean.
