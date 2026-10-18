# Legacy — preserved, not built

These files came with the original repositories and are kept so nothing
from them is lost in the unification. They are not part of the build.

- `vanilla-prototype/` — the plain-JavaScript prototype that sat at the
  root of `gv-frontend` (`api.js`, `app.js`, `config.js`, `styles.css`).
  The real client in `../client` is the React application in `src/`;
  this prototype was not imported by it. Its `config.js` pointed at
  `http://localhost:4000` with `/api/v1` endpoints — the design the
  unified client now implements relatively, without a hardcoded host.
- `world-clock/` — a standalone "World Clock" page that sat in
  `goldenvoice-backend/gv/frontend/`, unrelated to the Golden Voice
  modules. Preserved as-is.

## Added by the direct-connection rebuild (2026-10-18)

- `spa-client/` — the complete former Vite/React client (its `src/`,
  `index.html`, configs), whose pages fetched `/api/v1` through
  `workApiService.ts`. Replaced by server-rendered pages in
  `server/src/web/` that receive data directly from service calls.
- `api-layer/` — the former REST layer of the backend: the `routes/`
  and `controllers/` folders of all seven modules, which mounted
  `/api/v1/*`. Removed from the application by Henry's decision to
  forget the API entirely; preserved here for reference only. The
  services and repositories they called remain live in `server/`.
