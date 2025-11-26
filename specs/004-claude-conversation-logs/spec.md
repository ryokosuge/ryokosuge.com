# Feature Specification: Claude Conversation Logs

**Feature Branch**: `001-claude-conversation-logs`
**Created**: 2025-11-14
**Status**: Draft
**Input**: User description: "新しいコンテンツを増やしたいと思います。主にclaude君と話した内容をまとめて1ページ作っていく感じがいいかなと思っています!"

## Clarifications

### Session 2025-11-14

- Q: 会話ログファイルの命名規則は何か？（日付ベース vs ランダムID vs タイトルベース） → A: ランダム32文字ID（調べ物・英会話と同じパターン、プライバシー保護のため）
- Q: 会話ログのテンプレート構造はどうするか？ → A: 時系列フォーマット - Claude Codeとの会話をそのまま記録
- Q: 長い会話の扱いはどうするか？ → A: 長いまま1ページに表示 - シンプルな実装を優先、必要に応じて将来改善を検討
- Q: コンテンツディレクトリの名称は？ → A: conversations - 短くシンプル、汎用的なURL構造
- Q: アーキタイプファイルの名称は？ → A: conversations.md - ディレクトリ名と一致、Hugoの標準的な命名規則に従う
- Q: 作成方法は？ → A: `/save-conversation` スラッシュコマンドで自動生成 - 会話履歴から自動でファイル作成、タイトル・要約・タグも自動生成

## User Scenarios & Testing

### User Story 1 - Save Conversation with Slash Command (Priority: P1)

As a blog owner, I want to save my current Claude Code conversation to a blog post with a single slash command, so that I can easily capture and share interesting discussions without manual file creation or editing.

**Why this priority**: これはコア機能であり、ユーザーエクスペリエンスの根幹をなす。ワンコマンドで会話を保存できることが、この機能の最大の価値。

**Independent Test**: Can be fully tested by having a conversation in Claude Code, running `/save-conversation`, and verifying that a properly formatted markdown file is created in `content/conversations/` with auto-generated title, description, tags, and timestamped conversation content.

**Acceptance Scenarios**:

1. **Given** I have had a meaningful conversation with Claude Code, **When** I run `/save-conversation`, **Then** a new markdown file is created with a random 32-character ID in `content/conversations/`
2. **Given** I run `/save-conversation`, **When** the file is created, **Then** it contains the entire conversation session in chronological order (user messages and Claude responses)
3. **Given** I run `/save-conversation`, **When** the file is created, **Then** it has an auto-generated title based on conversation content
4. **Given** I run `/save-conversation`, **When** the file is created, **Then** it has an auto-generated description summarizing the key points
5. **Given** I run `/save-conversation`, **When** the file is created, **Then** it has auto-generated tags extracted from conversation topics
6. **Given** the conversation file is created, **When** I build the Hugo site, **Then** the conversation log page is generated and accessible via URL

---

### User Story 2 - Browse Conversation Logs (Priority: P2)

As a blog reader, I want to browse through all available conversation logs, so that I can explore different topics and discussions.

**Why this priority**: After creating conversation logs, users need a way to discover and access them. This enhances content discoverability but requires the creation functionality to exist first.

**Independent Test**: Can be tested by creating multiple conversation logs using `/save-conversation` and verifying they appear in a dedicated listing page or section with proper navigation.

**Acceptance Scenarios**:

1. **Given** multiple conversation log pages exist, **When** I navigate to the conversation logs section, **Then** I see a list of all conversation logs with auto-generated titles and dates
2. **Given** I am viewing the conversation logs list, **When** I click on a specific log, **Then** I am taken to the full conversation log page showing the timestamped dialogue
3. **Given** conversation logs span multiple pages, **When** I browse the list, **Then** pagination allows me to access all logs

---

### User Story 3 - Search and Filter Conversations (Priority: P3)

As a blog reader, I want to search and filter conversation logs by auto-generated tags or date, so that I can quickly find relevant discussions.

**Why this priority**: This is an enhancement that improves user experience but is not essential for the basic functionality. Users can still manually browse logs without search.

**Independent Test**: Can be tested by creating conversation logs with different topics, then verifying search and filter functionality returns correct results based on auto-generated tags.

**Acceptance Scenarios**:

1. **Given** multiple conversation logs exist with different auto-generated tags, **When** I filter by a specific tag, **Then** only logs with that tag are displayed
2. **Given** conversation logs span multiple months, **When** I filter by date range, **Then** only logs within that range are displayed
3. **Given** I have applied filters, **When** I clear filters, **Then** all conversation logs are displayed again

---

### Edge Cases

- What happens if `/save-conversation` is run when there's no conversation history? → Display error message and abort
- What happens if `/save-conversation` is run multiple times for the same conversation? → Create separate files each time (different random IDs)
- How does the system handle very long conversations? → Display as single page; future optimization (folding, pagination) can be added if needed
- What if AI fails to generate title/description/tags? → Use fallback defaults: "Conversation [date]", "No description", empty tags
- How are special characters in conversation (code blocks, markdown syntax) handled? → Properly escape and preserve as markdown code blocks

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a `/save-conversation` slash command in Claude Code
- **FR-002**: System MUST retrieve the entire current conversation session when `/save-conversation` is executed
- **FR-003**: System MUST generate a random 32-character alphanumeric ID for the filename (consistent with research-logs pattern)
- **FR-004**: System MUST create a markdown file at `content/conversations/[ID].md` with proper Hugo front matter
- **FR-005**: System MUST automatically generate a conversation title based on the content using AI analysis
- **FR-006**: System MUST automatically generate a description/summary of the conversation using AI analysis
- **FR-007**: System MUST automatically extract and generate relevant tags from the conversation topics using AI analysis
- **FR-008**: System MUST format the conversation in chronological order with timestamps, distinguishing between user and Claude messages
- **FR-009**: System MUST preserve code blocks, markdown formatting, and special characters from the conversation
- **FR-010**: System MUST display conversation logs as individual pages accessible via URL
- **FR-011**: System MUST list all conversation logs in a dedicated section of the blog (`/conversations/`)
- **FR-012**: System MUST allow conversation logs to be filtered by auto-generated tags
- **FR-013**: System MUST display conversation logs in chronological order (newest first by default)

### Key Entities

- **Conversation Session**: The complete dialogue between user and Claude Code in the current session, including all messages, timestamps, and metadata
- **Conversation Log**: A saved and published conversation represented as a markdown file, containing: auto-generated title, auto-generated description, auto-generated tags, chronologically ordered message pairs (user + Claude), and timestamps
- **Slash Command Handler**: The `/save-conversation` command implementation that orchestrates conversation retrieval, AI analysis, and file generation

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can save an entire conversation to a blog post with a single command (`/save-conversation`) in under 10 seconds
- **SC-002**: Auto-generated titles accurately reflect the main topic of the conversation in 80%+ of cases
- **SC-003**: Auto-generated descriptions provide useful summaries in 2-3 sentences
- **SC-004**: Auto-generated tags include 3-5 relevant keywords that aid in filtering and discovery
- **SC-005**: Conversation log pages render correctly with all formatting preserved (code blocks, lists, timestamps)
- **SC-006**: All conversation logs are accessible from a central listing page with clear navigation
- **SC-007**: Conversation logs are distinguishable from other content types in the blog structure

## Assumptions

- Conversation logs will be stored in `content/conversations/` directory following existing Hugo patterns
- Claude Code provides access to current conversation session history through available APIs or context
- AI-powered analysis (title/description/tag generation) can be performed using Claude's capabilities within the slash command
- Users understand that running `/save-conversation` multiple times creates separate files
- No manual editing of generated files is expected (files are generated once and published as-is)
- Conversation history includes both user messages and Claude responses with timestamps

## Dependencies

- Hugo static site generator must be properly configured
- ryokosuge-theme custom theme must support the new content type structure
- New slash command file (`.claude/commands/save-conversation.md`) must be created
- New archetype file (`archetypes/conversations.md`) must be created
- New content directory (`content/conversations/`) must be created
- `config.yaml` must be updated (mainSections, menu.main)
- Claude Code slash command system must support accessing conversation history
- AI capabilities within Claude Code for content analysis and generation

## Out of Scope

- Manual editing workflow for conversation logs (files are auto-generated and not expected to be edited)
- Real-time conversation logging or integration during the conversation
- Private or draft conversation logs (all saved logs are intended for publication)
- Comments or discussion features on conversation log pages
- Analytics or metrics tracking for conversation log page views
- Multi-language support beyond existing blog capabilities (Japanese/English as-is)
- Conversation editing or updating after initial save
- Selective message filtering (entire session is saved)
- Custom formatting options for conversation display
