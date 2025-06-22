import createApp from "@/api/lib/create-app";
import { registerRoutes } from "@/api/routes";

import configureOpenAPI from "./lib/configure-open-api";
import { IS_DEVELOPMENT } from "./lib/constants";

const app = registerRoutes(createApp());

// Only configure OpenAPI documentation in development
if (IS_DEVELOPMENT) {
  configureOpenAPI(app);
}

export default app;
