export function getEnvVar(key: string, defaultValue = ""): string {
  // eslint-disable-next-line node/no-process-env
  return process.env[key] || defaultValue;
}

export function getEnvConfig() {
  return {
    PORT: Number(getEnvVar("PORT", "3000")),
    AUTH_SECRET: getEnvVar("AUTH_SECRET"),
    GITHUB_CLIENT_ID: getEnvVar("GITHUB_CLIENT_ID"),
    GITHUB_CLIENT_SECRET: getEnvVar("GITHUB_CLIENT_SECRET"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
  };
}
