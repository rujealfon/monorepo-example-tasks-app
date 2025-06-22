import { authHandler } from "@hono/auth-js";
import { serveStatic } from "hono/bun";
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
    .use("*", async (c, next) => {
      // Skip all static handling for API routes
      if (c.req.path.startsWith(BASE_PATH)) {
        return next();
      }

      const path = c.req.path;

      // If the path has a file extension, serve it as a static file
      if (path.includes(".") && path.lastIndexOf(".") > path.lastIndexOf("/")) {
        return serveStatic({ root: "./public" })(c, next);
      }

      // For all other non-API routes (SPA routes), serve index.html
      const indexFile = Bun.file("./public/index.html");
      if (await indexFile.exists()) {
        const content = await indexFile.text();
        return c.html(content);
      }

      return next();
    });

  // Apply the basePath for API routes
  const apiApp = app.basePath(BASE_PATH) as AppOpenAPI;

  apiApp
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

  return apiApp;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
