import type { AuthConfig } from "@hono/auth-js";

import GitHub from "@auth/core/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { createDb } from "../db";

export default function createAuthConfig(): AuthConfig {
  return {
    adapter: DrizzleAdapter(createDb()),
    secret: Bun.env.AUTH_SECRET || "default-secret-for-development",
    providers: [
      GitHub({
        clientId: Bun.env.GITHUB_CLIENT_ID || "",
        clientSecret: Bun.env.GITHUB_CLIENT_SECRET || "",
      }),
    ],
  };
};
