import GitHub from "@auth/core/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { createDb } from "@/api/db";

import type { AppEnv } from "./types";

function createAuthConfig(env: AppEnv["Bindings"]) {
  return {
    adapter: DrizzleAdapter(createDb(env)),
    providers: [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      }),
    ],
    secret: env.AUTH_SECRET,
    trustHost: true,
  };
}

export default createAuthConfig;
