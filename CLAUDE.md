# AIDLC Workflow Configuration

This repository contains **AIDLC (AI-Driven Development Life Cycle) workflow rules** — markdown files that guide AI coding assistants through a structured software development process. There is no application code, no build system, and no tests.

## Repository Structure

```
.claude/rules/aidlc-core-workflow.md   # Core workflow definition (auto-loaded by Claude Code)
.aidlc-rule-details/                   # Phase-specific rule detail files
  common/                              # Shared rules (validation, formatting, session continuity)
  inception/                           # Planning phase (requirements, user stories, design)
  construction/                        # Build phase (functional design, code gen, testing)
  operations/                          # Deployment phase (placeholder)
  extensions/                          # Optional rule extensions (e.g., security baseline)
```

## How It Works

- `.claude/rules/aidlc-core-workflow.md` is automatically loaded as project instructions when Claude Code starts in this directory.
- That file defines the full AIDLC workflow and references rule detail files under `.aidlc-rule-details/`.
- When a user requests software development work, the workflow triggers and guides the AI through three phases: **Inception** (planning), **Construction** (implementation), and **Operations** (deployment).

## Communication

- Always respond in **Japanese**. Use Japanese for all explanations, comments, and communications with the user. Technical terms and code identifiers should remain in their original form.

## Development Notes

- **No build or test commands** — this is a markdown-only configuration repo.
- Edits should preserve the existing rule file structure and naming conventions.
- Extension opt-in files (`*.opt-in.md`) must have a corresponding rules file (same name without `.opt-in` suffix).
