// Centralizes reading and validating environment variables so that a
// missing configuration value fails loudly and early, instead of
// causing a confusing error deep inside some unrelated module
// (Trous principle 42: errors should be explicit).

function readRequiredEnvironmentVariable(variableName: string): string {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(
      `Missing required environment variable "${variableName}". Check your .env file against .env.example.`
    );
  }

  return value;
}

export function getPort(): number {
  return Number(process.env.PORT ?? 4000);
}

export function getJwtSecret(): string {
  return readRequiredEnvironmentVariable("JWT_SECRET");
}

export function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN ?? "7d";
}

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getCorsOrigins(): string[] {
  const rawOrigins = process.env.CORS_ORIGINS?.trim();

  if (!rawOrigins) {
    return ["http://localhost:3000"];
  }

  return rawOrigins.split(",").map((origin) => origin.trim()).filter(Boolean);
}
