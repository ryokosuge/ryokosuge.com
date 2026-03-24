import { Chat, toAiMessages, type Message } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { createAgentStream } from "./agent";

async function collectMessages(
  iter: AsyncIterable<Message>,
): Promise<Message[]> {
  const msgs: Message[] = [];
  for await (const m of iter) msgs.push(m);
  return msgs;
}

export function createBot() {
  const bot = new Chat({
    userName: process.env.SLACK_BOT_USERNAME || "ai-assistant",
    adapters: {
      slack: createSlackAdapter(),
    },
    state: createMemoryState(),
  });

  bot.onNewMention(async (thread, message) => {
    await thread.subscribe();
    await thread.startTyping("考え中...");

    const msgs = await collectMessages(thread.messages);
    const aiMessages = await toAiMessages(msgs);
    const result = await createAgentStream(aiMessages);
    await thread.post(result.fullStream);
  });

  bot.onSubscribedMessage(async (thread, message) => {
    await thread.startTyping("考え中...");

    const msgs = await collectMessages(thread.messages);
    const aiMessages = await toAiMessages(msgs);
    const result = await createAgentStream(aiMessages);
    await thread.post(result.fullStream);
  });

  bot.onDirectMessage(async (thread, message) => {
    await thread.subscribe();
    await thread.startTyping("考え中...");

    const msgs = await collectMessages(thread.messages);
    const aiMessages = await toAiMessages(msgs);
    const result = await createAgentStream(aiMessages);
    await thread.post(result.fullStream);
  });

  return bot;
}
