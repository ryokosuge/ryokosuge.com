
# Implementation Plan: ブログテーマの改善

**Branch**: `001-enhance-blog-design` | **Date**: 2025-10-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/workspaces/ryokosuge.com/specs/001-enhance-blog-design/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Hugo静的サイト用のカスタムテーマを1から作成。Tailwind CSS最新版を使用し、シンプルでモダンな印象の統一されたカラースキーム（水色よりの青をアクセントカラーとする）、日本語コンテンツに最適化されたタイポグラフィ、レスポンシブレイアウトを実装。ライトモード優先でダークモードにも対応し、コンテンツタイプ（research-logs、daily-logs、english-conversation）ごとに色やアイコンで軽く差別化する。

## Technical Context
**Language/Version**: Hugo (静的サイトジェネレータ), Tailwind CSS (最新版), HTML5
**Primary Dependencies**: Hugo, Tailwind CSS, PostCSS (Tailwindビルド用)
**Storage**: N/A（静的ファイル生成）
**Testing**: ローカルプレビュー (`make server` / `hugo server -D`)による視覚的検証
**Target Platform**: 静的Webサイト（モバイル/タブレット/デスクトップ対応）
**Project Type**: single（Hugo静的サイト）
**Performance Goals**: 初回ペイントの高速化、CSSファイルサイズの最小化、Tailwind JIT使用
**Constraints**: 既存Hugoコンテンツ構造との互換性維持、既存コンテンツの表示崩れ防止
**Scale/Scope**: 3つのコンテンツタイプ（research-logs、daily-logs、english-conversation）、全ページテンプレート実装

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Content-First Workflow**: ✅ PASS - テーマ作成は既存コンテンツワークフロー（daily logs、research logs、English conversation）をサポートする
**Template-Based Creation**: ✅ PASS - 既存のHugoアーキタイプと互換性を持つテーマを作成
**Japanese & English Support**: ✅ PASS - 日本語最適化のタイポグラフィと英語コンテンツ対応
**Git-Based Publishing**: ✅ PASS - 静的サイト生成プロセスに影響なし
**Local Development First**: ✅ PASS - `make server`でのローカルプレビュー機能維持
**Japanese-First Communication**: ✅ PASS - このドキュメント自体が日本語で記述

**結論**: 憲法違反なし。すべての原則と互換性あり。

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
themes/
└── ryokosuge-theme/          # 新規作成するカスタムテーマ
    ├── layouts/
    │   ├── _default/
    │   │   ├── baseof.html   # ベーステンプレート
    │   │   ├── list.html     # リスト表示
    │   │   └── single.html   # 個別記事
    │   ├── partials/
    │   │   ├── head.html
    │   │   ├── header.html
    │   │   ├── footer.html
    │   │   └── content-type-badge.html  # コンテンツタイプ別アイコン
    │   └── index.html        # トップページ
    ├── assets/
    │   ├── css/
    │   │   └── main.css      # Tailwind CSSエントリーポイント
    │   └── js/
    │       └── theme-toggle.js  # ダークモード切り替え
    ├── static/
    │   └── icons/            # SVGアイコン
    ├── theme.toml            # テーマメタデータ
    ├── tailwind.config.js    # Tailwind設定
    ├── postcss.config.js     # PostCSS設定
    └── package.json          # npm依存関係

config.yaml                   # Hugoメイン設定（テーマ指定更新）
```

**Structure Decision**: Hugo標準のテーマ構造を採用。Tailwind CSSはHugoのアセットパイプラインと統合し、PostCSSでビルド。既存のcontent/ディレクトリ構造は変更せず、テーマ側で対応。

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Create theme structure setup tasks
- Create configuration file tasks [P]
- Create template file tasks (baseof → partials → specific)
- Create styling tasks (Tailwind setup → typography → dark mode)
- Create verification tasks

**Ordering Strategy**:
1. **Setup Phase**: Theme directory structure, package.json, configs
2. **Configuration Phase**: Hugo config, Tailwind config, PostCSS config [P]
3. **Base Template Phase**: baseof.html with dark mode prevention
4. **Partials Phase**: head, header, footer, navigation [P]
5. **Content Templates Phase**: single.html, list.html, index.html [P]
6. **Styling Phase**: Main CSS, typography system, dark mode toggle
7. **Content Type Phase**: Badge partial with icon support
8. **Verification Phase**: Visual testing, quickstart validation

**Task Categories**:
- **[SETUP]**: Directory and file creation
- **[CONFIG]**: Configuration files
- **[TEMPLATE]**: HTML template files
- **[STYLE]**: CSS and styling
- **[COMPONENT]**: Reusable partials
- **[TEST]**: Verification tasks
- **[P]**: Can be executed in parallel

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**Dependencies**:
- Tailwind config depends on package.json
- Templates depend on baseof.html
- Partials can be created in parallel
- Styling depends on templates existing
- Testing depends on everything else

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (None - no violations)

**Artifacts Generated**:
- [x] research.md - Hugo theme and Tailwind CSS research
- [x] data-model.md - Theme configuration and content type entities
- [x] contracts/theme-structure.md - Theme directory structure contract
- [x] contracts/typography-system.md - Japanese typography contract
- [x] contracts/dark-mode-system.md - Dark mode implementation contract
- [x] quickstart.md - Setup and verification guide
- [x] CLAUDE.md updated - Agent context file updated

**Ready for Next Phase**: YES - /tasks command can now be executed

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
