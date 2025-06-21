import { defineConfig } from "drizzle-kit";

import { getEnvVar } from "./src/lib/env";

// PostgreSQL migrations are handled via drizzle-kit migrate
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dbCredentials: {
    url: getEnvVar("DATABASE_URL"),
  },
});
