import { createBot } from "./bot";

const bot = createBot();

// Expose webhook handler for Slack Events API
const server = Bun.serve({
  port: Number(process.env.PORT) || 3000,
  async fetch(request) {
    // Health check
    if (new URL(request.url).pathname === "/health") {
      return new Response("ok");
    }

    // Slack webhook
    return bot.webhooks.slack(request);
  },
});

console.log(`🤖 Bot server running on port ${server.port}`);
