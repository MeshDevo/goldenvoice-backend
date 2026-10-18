# Golden Voice — one application, direct connection, no API

Golden Voice used to be two repositories — `gv-frontend` (React SPA)
and `goldenvoice-backend` (Express API) — talking to each other over a
REST API. By Henry's decision (2026-10-18) that plan is abandoned:
**the API is gone entirely, and the frontend and backend are connected
directly in a single application.** This repository IS the former
`goldenvoice-backend`, renamed in content to `golden-voice` and
radically restructured into that single application; `gv-frontend`
remains untouched as the archive of the old client.

## How it works now

```text
Browser ──► Express server (one process)
              ├─ page handlers (src/web/)
              │    call the services DIRECTLY, as functions:
              │    listWorks() · getPublishedWorkById() · …
              │    then render the React pages to HTML on the server
              └─ services → repositories → Prisma → PostgreSQL
```

- The browser receives finished HTML pages. There is **no fetch, no
  `/api/v1`, no API client, no separate frontend build or deployment,
  no CORS** — none of it exists in this codebase anymore.
- Pages: `/` (home), `/works` (with `?type=` filtering and `?cursor=`
  pagination as plain links), `/works/:workId` (detail), plus `/health`.
- The page components live in `src/web/` — they are the old
  React components, changed to receive their data as props from the
  server handler instead of fetching it.
- The backend's service and repository layers are unchanged in spirit:
  modular monolith (auth, users, works, dubbed, translated, writing,
  assets) over Prisma/PostgreSQL. Only their entry point changed —
  page handlers (and future server-side form handlers) call them
  directly instead of HTTP controllers.

## Layout

```text
golden-voice/
  src/
    app/          the Express application — pages + services, one process
    web/          the frontend: pages, components, rendering (SSR)
    modules/      services, repositories, DTOs per module
    database/     the shared Prisma client
    shared/       config, errors, middleware, utils
  prisma/         schema.prisma
  public/         global.css for the rendered pages
  legacy/         everything removed by the unification, preserved:
    spa-client/   the old Vite/React SPA (fetch + /api/v1 client)
    api-layer/    the old REST routes + controllers of every module
    vanilla-prototype/ · world-clock/  (from the first unification pass)
  LICENSE         GV1.0 proprietary license (Ahmed Ali)
```

## Run it

```bash
cp .env.example .env          # fill in DATABASE_URL and JWT_SECRET
npm install
npm run prisma:generate
npm run dev                   # the whole application on http://localhost:4000
```

Production: `npm run build && npm start` — one Node process.

## Notes

- Three minimal behaviour-preserving compile fixes were made while
  unifying, because the original code did not pass its own build as
  committed: an unused `Prisma` import (dubbed repository), a
  `jwt.sign` typing mismatch (auth service), and a `HeadersInit`
  indexing error (old client service, now in `legacy/spa-client`).
- Write/admin features (creating works, auth pages, …) previously sat
  behind the REST controllers. Their services are all still here; in
  this architecture they return as server-rendered pages with form
  handlers calling the services directly — no API will be reintroduced
  for them.
- Verified on 2026-10-18: install, `prisma generate` and the full
  TypeScript build pass; the running server renders `/`, `/works` and
  `/works/:workId` directly from service calls (a running PostgreSQL
  is required for the data itself) and answers `/health`.

## License

GV1.0 — see [LICENSE](LICENSE). Owner: Ahmed Ali (أحمد علي).
