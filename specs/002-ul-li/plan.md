
# Implementation Plan: ul/li タグの箇条書きマーカー表示修正

**Branch**: `002-ul-li` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ul-li/spec.md`

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
箇条書きリスト（ul/li）のマーカー（箇条書き記号）が全ブログコンテンツで表示されていない問題を修正。小さい四角（▪）マーカーをテキスト色と同色で、全階層統一して表示する。現在のCSS設定が `padding-left: 0` および `margin-left: 0` でマーカーを非表示にしているため、CSS修正により対応。

## Technical Context
**Language/Version**: CSS3, Tailwind CSS v3.x, Hugo static site generator
**Primary Dependencies**: Tailwind CSS, Hugo (custom ryokosuge-theme)
**Storage**: N/A (static site styling)
**Testing**: Visual regression testing, cross-browser compatibility check
**Target Platform**: Modern web browsers (Chrome, Safari, Firefox), モバイル/デスクトップ対応
**Project Type**: Static site (Hugo blog with custom theme)
**Performance Goals**: No performance impact (CSS-only changes)
**Constraints**:
  - PaperModテーマデザインとの調和を保つ
  - ライト/ダークモード両対応
  - 既存のTailwind設定を維持
**Scale/Scope**: 全ブログコンテンツページ (research-logs, daily-logs, english-conversation)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitutional Principles Evaluation**:

✅ **I. Content-First Workflow**: N/A - This is a styling fix, not content creation

✅ **II. Template-Based Creation**: N/A - No new content templates required

✅ **III. Japanese & English Support**: COMPLIANT
   - CSS changes preserve UTF-8 encoding for Japanese text
   - List markers work for both Japanese and English content

✅ **IV. Git-Based Publishing**: COMPLIANT
   - Changes will be committed to Git
   - Will follow PR workflow with summary and details

✅ **V. Local Development First**: COMPLIANT
   - Testing will use `make server` / `hugo server -D`
   - Visual verification before deployment

✅ **VI. Japanese-First Communication**: COMPLIANT
   - Plan and documentation in Japanese where appropriate
   - Technical terms use English with Japanese context

**Result**: PASS - No constitutional violations detected

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
themes/ryokosuge-theme/
├── assets/
│   └── css/
│       └── main.css              # 修正対象: ul/li スタイル定義
├── layouts/                       # Hugo テンプレート（変更なし）
├── tailwind.config.js            # Tailwind設定（必要に応じて確認）
└── package.json                  # 依存関係（変更なし）

content/
├── research-logs/                # 影響範囲: マーカー表示
├── daily-logs/                   # 影響範囲: マーカー表示
└── english-conversation/         # 影響範囲: マーカー表示

public/                           # Hugo生成出力（テスト確認用）
```

**Structure Decision**: Hugo静的サイト構成。修正対象は `themes/ryokosuge-theme/assets/css/main.css` の `.prose-ja ul, .prose-ja ol` セクション。全コンテンツタイプで使用される共通CSSのため、単一ファイル修正で全ページに影響。

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
- Generate tasks from Phase 1 design docs (contracts, data-model, quickstart)
- CSS修正は単一ファイル変更のため、タスク数は少ない（5-8タスク想定）
- 契約テスト = Visual test checklist（自動化なし）

**Task Categories**:

1. **準備タスク** [P]
   - ブランチ確認
   - 依存関係インストール確認

2. **実装タスク**
   - CSS修正（main.css）
     - ul スタイル更新
     - ol スタイル追加
     - li スタイル調整

3. **テストタスク**
   - ローカルサーバー起動テスト
   - Visual regression test（手動チェックリスト）
     - 各コンテンツタイプで確認
     - ネストリストテスト
     - ライト/ダークモードテスト
   - クロスブラウザテスト
   - モバイルレスポンシブテスト

4. **デプロイタスク**
   - 本番ビルド確認
   - PR作成
   - マージ & デプロイ

**Ordering Strategy**:
- 準備 → 実装 → テスト → デプロイ の直列フロー
- テスト内のサブタスクは並行可能 [P]
- CSS変更は単一ファイルのため、並列化不要

**Dependency Map**:
```
準備完了
  ↓
CSS実装
  ↓
ローカルテスト起動
  ↓
┌─────────────┬─────────────┬──────────────┐
│ Visual Test │ Cross-      │ Mobile Test  │ [P]
│ (checklist) │ Browser     │              │
└─────────────┴─────────────┴──────────────┘
  ↓
本番ビルド確認
  ↓
PR作成 & マージ
```

**Estimated Output**: 8-10 numbered, ordered tasks in tasks.md

**Task Template Reference**:
- Contract → Manual visual test tasks (automated test 将来拡張)
- Quickstart → Implementation & deployment tasks
- Data-model → CSS property modification tasks

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
- [x] Phase 0: Research complete (/plan command) → research.md created
- [x] Phase 1: Design complete (/plan command) → data-model.md, contracts/, quickstart.md, CLAUDE.md created
- [x] Phase 2: Task planning complete (/plan command - approach described)
- [x] Phase 3: Tasks generated (/tasks command) → tasks.md created (9 tasks)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (no violations)
- [x] Post-Design Constitution Check: PASS (no new violations)
- [x] All NEEDS CLARIFICATION resolved (clarification session completed)
- [x] Complexity deviations documented (N/A - no deviations)

**Generated Artifacts**:
- ✅ `/specs/002-ul-li/research.md` - 技術調査と実装方針
- ✅ `/specs/002-ul-li/data-model.md` - CSSプロパティマッピング
- ✅ `/specs/002-ul-li/contracts/css-contract.md` - CSS契約定義
- ✅ `/specs/002-ul-li/quickstart.md` - 実装・テスト・デプロイ手順
- ✅ `/specs/002-ul-li/tasks.md` - 実行可能タスクリスト (9 tasks)
- ✅ `/CLAUDE.md` - Updated with CSS/Hugo context

---
*Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`*
