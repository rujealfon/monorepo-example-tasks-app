import { authHandler } from "@hono/auth-js";
import { serveStatic } from "@hono/node-server/serve-static";
import { notFound, onError } from "stoker/middlewares";

import type { AppOpenAPI } from "./types";

import { createDb } from "../db";
import { BASE_PATH } from "./constants";
import createAuthConfig from "./create-auth-config";
import createRouter from "./create-router";

export default function createApp() {
  const app = createRouter()
    .use("*", async (c, next) => {
      // Set up database connection
      c.set("db", createDb());
      return next();
    })
    .use("*", (c, next) => {
      if (c.req.path.startsWith(BASE_PATH)) {
        return next();
      }
      // Serve static files for SPA
      return serveStatic({ root: "./public" })(c, next);
    })
    .basePath(BASE_PATH) as AppOpenAPI;

  app
    .use(
      "*",
      async (c, next) => {
        c.set("authConfig", createAuthConfig());
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
