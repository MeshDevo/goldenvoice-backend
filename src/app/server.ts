import dotenv from "dotenv";

dotenv.config();

import { createGoldenVoiceApp } from "./app";
import { getPort } from "../shared/config/environment";
import { prismaClient } from "../database/prismaClient";

const app = createGoldenVoiceApp();
const port = getPort();

app.listen(port, () => {
  console.log(`Golden Voice backend is running on http://localhost:${port}`);
});


const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down Golden Voice backend...`);
  await prismaClient.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
