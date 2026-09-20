import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "../shared/errors/errorHandler";
import { authRoutes } from "../modules/auth/routes/authRoutes";
import { userRoutes } from "../modules/users/routes/userRoutes";
import { workRoutes } from "../modules/works/routes/workRoutes";
import { dubbedRoutes } from "../modules/dubbed/routes/dubbedRoutes";
import { translatedRoutes } from "../modules/translated/routes/translatedRoutes";
import { scriptRoutes } from "../modules/writing/routes/scriptRoutes";
import { getCorsOrigins } from "../shared/config/environment";
import { assetRoutes } from "../modules/assets/routes/assetRoutes";

// This file only wires modules together. It contains no business logic
// of its own (Trous principle 45).
export function createGoldenVoiceApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: getCorsOrigins() }));
  app.use(express.json({ limit: "1mb" }));

  // Simple liveness check, useful for deployment platforms and monitoring.
  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  // Every module is mounted under its own base path, matching the
  // module boundaries described in the architecture doc (section 18).
  const API_BASE_PATH = "/api/v1";
  app.use(`${API_BASE_PATH}/auth`, authRoutes);
  app.use(`${API_BASE_PATH}/users`, userRoutes);
  app.use(`${API_BASE_PATH}/works`, workRoutes);
  app.use(`${API_BASE_PATH}/dubbed`, dubbedRoutes);
  app.use(`${API_BASE_PATH}/translated`, translatedRoutes);
  app.use(`${API_BASE_PATH}/scripts`, scriptRoutes);
  app.use(`${API_BASE_PATH}/assets`, assetRoutes);

  // Must be registered after all routes.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
