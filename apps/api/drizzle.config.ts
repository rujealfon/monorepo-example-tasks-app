import { defineConfig } from "drizzle-kit";
import { readFileSync } from "node:fs";

// Load DATABASE_URL from .dev.vars file
let databaseUrl: string | undefined;

try {
  const devVars = readFileSync(".dev.vars", "utf8");
  devVars.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const [key, ...valueParts] = trimmedLine.split("=");
      if (key === "DATABASE_URL" && valueParts.length > 0) {
        databaseUrl = valueParts.join("=").replace(/^"(.*)"$/, "$1");
      }
    }
  });
}
catch {
  throw new Error("DATABASE_URL not found. Please create a .dev.vars file with DATABASE_URL defined.");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is empty. Please check your .dev.vars file.");
}

// only used to create migrations
export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl!,
  },
});
