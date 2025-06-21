import { serveStatic } from "hono/bun";

import app from "./app";
import { getEnvConfig } from "./lib/env";

// Serve static files from the web app build directory
app.use("/*", serveStatic({
  root: "../../web/dist",
  rewriteRequestPath: (path) => {
    // Serve index.html for SPA routes that don't match API or static assets
    if (!path.startsWith("/api") && !path.includes(".")) {
      return "/index.html";
    }
    return path;
  },
}));

const { PORT } = getEnvConfig();

console.warn(`Server is running on port ${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
