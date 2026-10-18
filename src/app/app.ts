import express, { Express } from "express";
import helmet from "helmet";
import path from "path";
import { errorHandler, notFoundHandler } from "../shared/errors/errorHandler";
import { webRoutes } from "../web/webRoutes";

// One application, one process. The pages ARE the frontend and they are
// rendered here, in the same process as the backend services, calling
// them directly (see web/webRoutes.tsx). There is no API layer, no
// separate frontend deployment, and no cross-origin anything.
export function createGoldenVoiceApp(): Express {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  // Simple liveness check, useful for deployment platforms and monitoring.
  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  // Static assets for the server-rendered pages (global.css).
  app.use(express.static(path.resolve(__dirname, "../../public")));

  // The pages themselves: home, works, work detail — data loaded
  // in-process by direct service calls, rendered to HTML on the server.
  app.use(webRoutes);

  // Must be registered after all routes.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
