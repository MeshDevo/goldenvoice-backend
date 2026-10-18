import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Unified codebase: in development the client runs on Vite's port and
// proxies every /api (and /health) call to the Golden Voice server in
// ../server — same repository, same `npm run dev` from the root.
// In production the server serves this client's build directly, so the
// browser only ever talks to one origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
      "/health": "http://localhost:4000",
    },
  },
});
