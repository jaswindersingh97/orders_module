import { app } from "./app";

const port = Number(Bun.env.API_PORT ?? 4000);

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`API running on http://localhost:${port}`);
