import { authHandler } from "@hono/auth-js";
import { notFound, onError } from "stoker/middlewares";

import type { AppOpenAPI } from "./types";

import { BASE_PATH } from "./constants";
import createAuthConfig from "./create-auth-config";
import createRouter from "./create-router";
import { getEnvConfig } from "./env";

export default function createApp() {
  const app = createRouter()
    .basePath(BASE_PATH) as AppOpenAPI;

  app
    .use(
      "*",
      async (c, next) => {
        // Set up environment variables for auth config
        const env = getEnvConfig();
        c.set("authConfig", createAuthConfig(env));
        return next();
      },
    )
    .use("/auth/*", authHandler())
    .notFound(notFound)
    .onError(onError);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
