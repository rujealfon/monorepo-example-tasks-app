import type { AuthConfig } from "@hono/auth-js";

import GitHub from "@auth/core/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import type { AppEnv } from "./types";

import { createDb } from "../db";

export default function createAuthConfig(env: AppEnv["Bindings"]): AuthConfig {
  return {
    adapter: DrizzleAdapter(createDb(env)),
    secret: env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      }),
    ],
  };
};
