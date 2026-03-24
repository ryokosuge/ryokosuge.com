import { streamText, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { tools } from "./tools";

const model = anthropic("claude-sonnet-4-20250514");

const systemPrompt = `You are a helpful AI assistant in a Slack workspace.
You can search and read files on the local file system to help answer questions about the codebase.

Available tools:
- searchFiles: Find files by glob pattern
- readFileContent: Read file contents
- grepCode: Search file contents by keyword/regex

When asked about code, use these tools to find and read relevant files before answering.
Be concise and format responses for Slack (use markdown sparingly).`;

export function createAgentStream(
  messages: Parameters<typeof streamText>[0]["messages"],
) {
  return streamText({
    model,
    system: systemPrompt,
    messages,
    tools,
    stopWhen: stepCountIs(10),
  });
}
