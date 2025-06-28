import { serve } from "@hono/node-server";

import app from "./app";

const { PORT } = process.env;
const port = Number(PORT) || 3000;

console.log(`🚀 Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
