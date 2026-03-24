import { tool } from "ai";
import { z } from "zod";
import { glob } from "glob";
import { readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";

const BASE_DIR = process.env.SEARCH_BASE_DIR || "/workspace";

function safePath(inputPath: string): string {
  const resolved = resolve(BASE_DIR, inputPath);
  if (!resolved.startsWith(resolve(BASE_DIR))) {
    throw new Error("Path traversal not allowed");
  }
  return resolved;
}

export const searchFiles = tool({
  description:
    "Search for files by glob pattern (e.g. '**/*.ts', 'src/**/*.json'). Returns matching file paths.",
  inputSchema: z.object({
    pattern: z.string().describe("Glob pattern to match files"),
    maxResults: z
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of results to return"),
  }),
  execute: async ({ pattern, maxResults }) => {
    const matches = await glob(pattern, {
      cwd: BASE_DIR,
      nodir: true,
      ignore: ["node_modules/**", ".git/**"],
      maxDepth: 10,
    });
    const limited = matches.slice(0, maxResults);
    return {
      totalMatches: matches.length,
      showing: limited.length,
      files: limited,
    };
  },
});

export const readFileContent = tool({
  description:
    "Read the content of a file at the given path. Use this to inspect source code or configuration files.",
  inputSchema: z.object({
    path: z.string().describe("File path relative to the workspace root"),
    startLine: z
      .number()
      .optional()
      .describe("Start reading from this line number (1-based)"),
    endLine: z
      .number()
      .optional()
      .describe("Stop reading at this line number (inclusive)"),
  }),
  execute: async ({ path, startLine, endLine }) => {
    const fullPath = safePath(path);
    const content = await readFile(fullPath, "utf-8");
    const lines = content.split("\n");

    if (startLine || endLine) {
      const start = (startLine ?? 1) - 1;
      const end = endLine ?? lines.length;
      const sliced = lines.slice(start, end);
      return {
        path,
        totalLines: lines.length,
        showing: `${start + 1}-${Math.min(end, lines.length)}`,
        content: sliced.join("\n"),
      };
    }

    if (lines.length > 500) {
      return {
        path,
        totalLines: lines.length,
        content: lines.slice(0, 500).join("\n"),
        truncated: true,
        message:
          "File truncated at 500 lines. Use startLine/endLine to read specific sections.",
      };
    }

    return { path, totalLines: lines.length, content };
  },
});

export const grepCode = tool({
  description:
    "Search file contents for a keyword or regex pattern. Returns matching lines with context.",
  inputSchema: z.object({
    pattern: z.string().describe("Search pattern (string or regex)"),
    glob: z
      .string()
      .optional()
      .default("**/*")
      .describe("Glob pattern to filter which files to search"),
    maxResults: z
      .number()
      .optional()
      .default(30)
      .describe("Maximum number of matching lines to return"),
  }),
  execute: async ({ pattern, glob: fileGlob, maxResults }) => {
    const files = await glob(fileGlob, {
      cwd: BASE_DIR,
      nodir: true,
      ignore: ["node_modules/**", ".git/**", "*.lock", "*.min.*"],
      maxDepth: 10,
    });

    const regex = new RegExp(pattern, "gi");
    const results: { file: string; line: number; content: string }[] = [];

    for (const file of files) {
      if (results.length >= maxResults) break;
      try {
        const fullPath = resolve(BASE_DIR, file);
        const content = await readFile(fullPath, "utf-8");
        const lines = content.split("\n");

        for (let i = 0; i < lines.length; i++) {
          if (results.length >= maxResults) break;
          if (regex.test(lines[i])) {
            results.push({
              file: relative(BASE_DIR, fullPath),
              line: i + 1,
              content: lines[i].trim(),
            });
          }
          regex.lastIndex = 0;
        }
      } catch {
        // skip unreadable files
      }
    }

    return {
      pattern,
      totalMatches: results.length,
      matches: results,
    };
  },
});

export const tools = { searchFiles, readFileContent, grepCode };
