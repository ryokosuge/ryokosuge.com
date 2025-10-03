<!--
Sync Impact Report:
Version: 1.0.0 → 1.1.0
Rationale: Add Japanese communication principle for AI assistant interactions

Modified Principles:
- III. Japanese & English Support → Expanded to include AI communication language

Added Principles:
- VI. Japanese-First Communication

Templates Status:
✅ plan-template.md - No updates needed
✅ spec-template.md - No updates needed
✅ tasks-template.md - No updates needed

Follow-up TODOs:
- None
-->

# ryokosuge.com Constitution

## Core Principles

### I. Content-First Workflow
Every piece of content MUST follow the established archetype workflow (daily logs, research logs, English conversation). Content creation MUST be assisted through conversational/interview style to ensure completeness and quality. Content files MUST use Hugo front matter with appropriate metadata (title, date, draft status, tags).

**Rationale**: Structured workflows ensure consistent, high-quality content while maintaining the personal nature of the blog.

### II. Template-Based Creation
All new content MUST use Hugo archetypes as templates. Daily logs use date-based filenames (`YYYYMMDD.md`). Research logs and English conversation use random 32-character alphanumeric identifiers for privacy and uniqueness. Templates MUST include required sections for each content type.

**Rationale**: Templates enforce structure while random IDs protect privacy for sensitive research and conversation practice.

### III. Japanese & English Support
Content MUST support both Japanese and English text. Daily logs and research logs are primarily Japanese. English conversation content is primarily English. All formatting MUST preserve proper encoding (UTF-8) for Japanese characters. Interface and metadata use Japanese conventions where appropriate.

**Rationale**: The blog serves both language learning and documentation purposes in the author's native and target languages.

### IV. Git-Based Publishing
All content changes MUST be committed to Git before publishing. Commits SHOULD follow conventional commit format (feat:, fix:, chore:, docs:). Pull requests MUST include summary, details, and references. Deployment occurs via static site generation from the `main` branch.

**Rationale**: Version control provides history, allows for review, and enables rollback of published content.

### V. Local Development First
Content MUST be previewed locally using `make server` or `hugo server -D` before publishing. Hugo development server MUST be used to verify formatting, links, and front matter. No content should be pushed without local verification.

**Rationale**: Local preview catches formatting errors and ensures content appears as intended before public deployment.

### VI. Japanese-First Communication
AI assistants (Claude Code, GitHub Copilot, etc.) MUST communicate in Japanese when interacting with the user for content creation, workflow guidance, and general assistance. English MAY be used only when specifically working on English conversation content or when explicitly requested by the user. All explanations, confirmations, and conversational interactions MUST default to Japanese.

**Rationale**: The primary user is a Japanese speaker, and Japanese-language interaction reduces cognitive load and improves workflow efficiency for content creation and project management tasks.

## Content Quality Standards

### Daily Log Requirements
- MUST be approximately 400 characters in Japanese
- MUST maintain positive perspective
- MUST anonymize personal names (using A-san, B-san conventions)
- MUST use line breaks after sentence endings (。、)
- MUST include both "今日やったこと" (what I did) and "今日の振り返り" (reflection) sections

### Research Log Requirements
- MUST document the original question ("知りたかったこと")
- MUST explain motivation ("知りたいと思った理由")
- MUST cite sources ("参考にしたサイトやページ")
- MUST summarize findings ("調べた内容")
- MUST capture outcomes and gaps ("わかったこと、わからなかったこと")
- Web research SHOULD progressively filter (10 → 5 → 3 sources)
- Individual sources SHOULD be summarized in ~300 characters
- Overall summary SHOULD be ~600 characters

### English Conversation Requirements
- MUST include natural conversation exchange (2-3 turns)
- MUST provide feedback on language use
- MUST include polished/model script
- Topics SHOULD be randomly selected for variety
- Conversations MUST feel natural, not scripted

## Development & Deployment Workflow

### Setup Requirements
- PaperMod theme MUST be initialized as Git submodule (`make submodule`)
- GitHub CLI MUST be authenticated for PR workflows (`make prepare`)
- Hugo MUST be installed and functional for local development

### Content Creation Workflow
1. Generate content file using appropriate Hugo archetype command
2. Engage in conversational content gathering (interview style)
3. Fill content following template structure
4. Preview locally using development server
5. Commit changes with descriptive message
6. Create pull request if workflow requires review
7. Merge to main for deployment

### Theme & Configuration Updates
- Theme updates via `git submodule update --remote themes/PaperMod`
- Configuration changes in `config.yaml` MUST be tested locally first
- Archetype modifications MUST be validated with test content before adoption

## Governance

### Constitution Authority
This constitution defines the content creation and development practices for ryokosuge.com. All workflows, slash commands, and automated processes MUST comply with these principles. When practices conflict with constitutional principles, the constitution takes precedence.

### Amendment Process
Amendments require:
1. Documentation of the proposed change and rationale
2. Validation that templates and workflows remain consistent
3. Version increment following semantic versioning
4. Update of dependent command files and templates

### Versioning Policy
- **MAJOR**: Changes to core content principles or removal of content types
- **MINOR**: New content types, sections, or expanded workflow guidance
- **PATCH**: Clarifications, wording improvements, formatting fixes

### Compliance
All pull requests SHOULD verify compliance with content quality standards. Complexity in workflows MUST be justified (e.g., why random IDs vs. sequential, why specific character counts). Command files in `.claude/commands/` provide runtime guidance and MUST align with constitutional principles.

**Version**: 1.1.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
