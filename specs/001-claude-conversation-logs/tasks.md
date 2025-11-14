---
description: "Task list for Claude Conversation Logs feature implementation"
---

# Tasks: Claude Conversation Logs

**Input**: Design documents from `/specs/001-claude-conversation-logs/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md, research.md

**Tests**: テスト項目は仕様書で明示的に要求されていないため、このタスクリストには含まれていません。

**Organization**: タスクはユーザーストーリーごとにグループ化され、各ストーリーを独立して実装・テストできるようになっています。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: このタスクが属するユーザーストーリー（US1, US2, US3）
- 説明には正確なファイルパスを含む

## Path Conventions

このプロジェクトはHugoベースの静的サイトです：
- `.claude/commands/` - スラッシュコマンド定義
- `archetypes/` - Hugoコンテンツテンプレート
- `content/conversations/` - 会話ログMarkdownファイル
- `config.yaml` - Hugo設定ファイル
- `themes/ryokosuge-theme/` - カスタムテーマ（Tailwind CSS）

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: プロジェクト初期化と基本構造の作成

- [X] T001 `content/conversations/` ディレクトリを作成
- [X] T002 [P] `archetypes/conversations.md` テンプレートファイルを作成
- [X] T003 [P] `.claude/commands/save-conversation.md` スラッシュコマンドファイルを作成

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべてのユーザーストーリーを実装する前に完了する必要があるコアインフラ

**⚠️ CRITICAL**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

- [X] T004 `config.yaml` の `mainSections` に `conversations` を追加
- [X] T005 [P] `config.yaml` の `menu.main` に conversations セクションを追加（weight: 4）
- [X] T006 [P] ryokosuge-themeがconversationsコンテンツタイプをサポートしているか確認（list.html, single.htmlの動作確認）

**Checkpoint**: 基盤準備完了 - ユーザーストーリーの実装を並列で開始可能

---

## Phase 3: User Story 1 - Save Conversation with Slash Command (Priority: P1) 🎯 MVP

**Goal**: ユーザーがClaude Codeで会話した後、`/save-conversation`コマンドを実行するだけで、タイトル・要約・タグが自動生成された会話ログページが作成される

**Independent Test**: Claude Codeで会話を行い、`/save-conversation`を実行し、`content/conversations/[32文字ID].md`にフロントマター（自動生成されたtitle, description, tags）と時系列の会話内容を持つMarkdownファイルが作成されることを確認。`hugo server -D`でローカルプレビューし、ページが正しくレンダリングされることを確認。

### Implementation for User Story 1

- [X] T007 [US1] `archetypes/conversations.md` に基本フロントマター構造を定義（date, draft, title, description, tags）
- [X] T008 [US1] `.claude/commands/save-conversation.md` に会話履歴取得ロジックを実装（Claude Codeコンテキストから現在セッション全体を取得）
- [X] T009 [US1] `.claude/commands/save-conversation.md` にAI分析ロジックを実装（タイトル生成: 会話の主題を1文30-60文字で要約）
- [X] T010 [US1] `.claude/commands/save-conversation.md` にAI分析ロジックを実装（要約生成: 2-3文100-200文字で重要ポイントを抽出）
- [X] T011 [US1] `.claude/commands/save-conversation.md` にAI分析ロジックを実装（タグ生成: 3-5個の重要キーワードを抽出）
- [X] T012 [US1] `.claude/commands/save-conversation.md` にランダムID生成ロジックを実装（32文字英数字、`openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32`）
- [X] T013 [US1] `.claude/commands/save-conversation.md` に会話フォーマット変換ロジックを実装（時系列、タイムスタンプ付き、ユーザーとClaudeを区別）
- [X] T014 [US1] `.claude/commands/save-conversation.md` にMarkdownファイル生成・保存ロジックを実装（`content/conversations/[ID].md`に保存）
- [X] T015 [US1] `.claude/commands/save-conversation.md` に完了メッセージ表示ロジックを実装（ファイルパス、タイトル、タグを表示）
- [X] T016 [US1] `.claude/commands/save-conversation.md` にエラーハンドリングを追加（会話が空の場合、AI生成失敗時のフォールバック）
- [X] T017 [US1] 実際の会話でテスト実行：`/save-conversation`を実行し、ファイルが正しく生成されるか確認（手動テストで動作確認済み、2つの会話ログファイル作成）
- [X] T018 [US1] `hugo server -D`でローカルプレビューし、生成された会話ログページが正しくレンダリングされることを確認（完了：一覧ページ・個別ページ・バッジ表示を確認）
- [X] T019 [US1] 特殊文字・コードブロック・Markdown記法が正しくエスケープされているか確認（会話内のコードが適切に保存されるか）（完了：会話ログ内のコードブロックが正しく表示されることを確認）

**Checkpoint**: この時点で、ユーザーストーリー1が完全に機能し、独立してテスト可能な状態になっているはずです

---

## Phase 4: User Story 2 - Browse Conversation Logs (Priority: P2)

**Goal**: ユーザーがブログ上で会話ログ一覧を閲覧でき、各ログのタイトル・日付・タグが表示され、クリックすることで個別の会話ログページにアクセスできる

**Independent Test**: 複数の会話ログを作成（`/save-conversation`を複数回実行）し、`/conversations/`にアクセスして、すべての会話ログが新しい順にリストアップされ、タイトル・日付が表示されることを確認。任意のログをクリックして個別ページに遷移できることを確認。

### Implementation for User Story 2

- [ ] T020 [US2] ryokosuge-themeの`layouts/conversations/list.html`テンプレートを確認・必要に応じて作成（会話ログ一覧表示用）
- [ ] T021 [US2] `layouts/conversations/list.html`で会話ログを新しい順（日付降順）に表示するロジックを実装
- [ ] T022 [US2] `layouts/conversations/list.html`で各ログのタイトル、日付、descriptionを表示
- [ ] T023 [US2] `layouts/conversations/list.html`でページネーション機能を実装（会話ログが多数になった場合）
- [ ] T024 [US2] ryokosuge-themeの`layouts/conversations/single.html`テンプレートを確認・必要に応じて作成（個別会話ログページ表示用）
- [ ] T025 [US2] `layouts/conversations/single.html`で会話内容を時系列フォーマットで表示（タイムスタンプ、発言者区別）
- [ ] T026 [US2] `layouts/conversations/single.html`でタグ表示機能を実装（各タグはクリック可能、タグページへリンク）
- [ ] T027 [US2] メニューに会話ログセクションが表示されることを確認（config.yamlのmenu.main設定が反映されているか）
- [ ] T028 [US2] `hugo server -D`で会話ログ一覧ページ（`/conversations/`）と個別ページを確認
- [ ] T029 [US2] レスポンシブデザイン確認（モバイル・タブレット・デスクトップで適切に表示されるか）

**Checkpoint**: この時点で、ユーザーストーリー1とユーザーストーリー2の両方が独立して機能しているはずです

---

## Phase 5: User Story 3 - Search and Filter Conversations (Priority: P3)

**Goal**: ユーザーが会話ログを自動生成されたタグや日付でフィルタリングでき、関連する会話をすばやく見つけられる

**Independent Test**: タグが異なる複数の会話ログを作成し、特定のタグをクリックして、そのタグを持つ会話ログのみが表示されることを確認。日付範囲でフィルタリングできることを確認。フィルタをクリアすると全会話ログが再表示されることを確認。

### Implementation for User Story 3

- [ ] T030 [US3] Hugoのタグ機能が有効になっていることを確認（config.yamlのtaxonomies設定）
- [ ] T031 [US3] ryokosuge-themeの`layouts/_default/terms.html`を確認・作成（タグ一覧ページ `/tags/`）
- [ ] T032 [US3] ryokosuge-themeの`layouts/_default/taxonomy.html`を確認・作成（特定タグの会話ログ一覧 `/tags/[tag]/`）
- [ ] T033 [US3] `layouts/conversations/list.html`にタグフィルタUIを追加（タグ一覧へのリンク表示）
- [ ] T034 [US3] `layouts/conversations/list.html`に日付範囲フィルタUIを追加（年別・月別アーカイブ表示）
- [ ] T035 [US3] タグページ（`/tags/[tag]/`）で会話ログが新しい順に表示されることを確認
- [ ] T036 [US3] タグページにフィルタクリア機能を追加（全会話ログ一覧に戻るリンク）
- [ ] T037 [US3] `hugo server -D`で各タグページにアクセスし、フィルタリングが正しく動作することを確認
- [ ] T038 [US3] 複数タグを持つ会話ログが各タグページに正しく表示されることを確認

**Checkpoint**: すべてのユーザーストーリーが独立して機能しているはずです

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 複数のユーザーストーリーに影響する改善

- [ ] T039 [P] `quickstart.md`の手順を実際に実行し、ドキュメントが正確であることを確認
- [ ] T040 [P] `data-model.md`のバリデーションルールが実装されていることを確認（ファイル名32文字、フロントマターYAML形式、date ISO 8601など）
- [ ] T041 [P] 長い会話ログのパフォーマンステスト（数百メッセージの会話を保存してレンダリング速度確認）
- [ ] T042 日本語・英語両方のコンテンツで会話ログが正しく表示されることを確認
- [ ] T043 [P] エッジケースのテスト（空の会話、特殊文字多用、非常に長いタイトル、タグなしなど）
- [ ] T044 [P] AI生成フォールバック動作の確認（タイトル生成失敗時、要約生成失敗時、タグ生成失敗時）
- [ ] T045 SEO最適化の確認（meta description、og:imageなどがryokosuge-themeで適切に設定されているか）
- [ ] T046 [P] 本番ビルド確認（`hugo`コマンドで静的ファイル生成、public/conversations/ディレクトリ確認）
- [ ] T047 最終的な統合テスト（会話ログ作成→一覧表示→個別ページ→タグフィルタの一連の流れ）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存関係なし - すぐに開始可能
- **Foundational (Phase 2)**: Setup完了に依存 - すべてのユーザーストーリーをブロック
- **User Stories (Phase 3-5)**: すべてFoundational完了に依存
  - ユーザーストーリーは並列で進行可能（チーム体制がある場合）
  - または優先度順に順次進行（P1 → P2 → P3）
- **Polish (Phase 6)**: 実装したいすべてのユーザーストーリーが完了していることに依存

### User Story Dependencies

- **User Story 1 (P1)**: Foundational完了後に開始可能 - 他のストーリーへの依存なし
- **User Story 2 (P2)**: Foundational完了後に開始可能 - US1に依存（会話ログファイルが存在する必要がある）
- **User Story 3 (P3)**: Foundational完了後に開始可能 - US2に依存（一覧表示・タグ表示が実装されている必要がある）

### Within Each User Story

- US1: 会話履歴取得 → AI分析 → ファイル生成 → テスト
- US2: テンプレート確認/作成 → 一覧表示ロジック → 個別ページロジック → テスト
- US3: タグ機能確認 → フィルタUI実装 → テスト

### Parallel Opportunities

- Phase 1: T001, T002, T003 はすべて並列実行可能
- Phase 2: T005, T006 は並列実行可能（T004完了後）
- Phase 6: T039, T040, T041, T043, T044, T045, T046 は並列実行可能

ただし、ユーザーストーリー間には依存関係があるため、完全な並列実行は推奨されません：
- US2 は US1 完了後に開始（会話ログファイルが必要）
- US3 は US2 完了後に開始（一覧表示・タグ表示が必要）

---

## Parallel Example: Phase 1 (Setup)

```bash
# Phase 1のすべてのタスクを並列実行:
Task: "content/conversations/ ディレクトリを作成"
Task: "archetypes/conversations.md テンプレートファイルを作成"
Task: ".claude/commands/save-conversation.md スラッシュコマンドファイルを作成"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1完了: Setup
2. Phase 2完了: Foundational（重要 - すべてのストーリーをブロック）
3. Phase 3完了: User Story 1
4. **停止して検証**: User Story 1を独立してテスト
5. 準備ができていればデプロイ/デモ

この時点で、`/save-conversation`コマンドで会話ログを保存し、Hugoでページが生成される基本機能が完成します。

### Incremental Delivery

1. Setup + Foundational完了 → 基盤準備完了
2. User Story 1追加 → 独立してテスト → デプロイ/デモ（MVP！）
3. User Story 2追加 → 独立してテスト → デプロイ/デモ（一覧・閲覧機能）
4. User Story 3追加 → 独立してテスト → デプロイ/デモ（検索・フィルタ機能）
5. 各ストーリーは、前のストーリーを壊すことなく価値を追加

### Parallel Team Strategy

複数の開発者がいる場合：

1. チーム全体でSetup + Foundationalを完了
2. Foundational完了後：
   - Developer A: User Story 1
   - Developer B: User Story 2（US1完了を待つ）
   - Developer C: User Story 3（US2完了を待つ）
3. ストーリーは独立して完成・統合

**注意**: このプロジェクトでは US2 → US1、US3 → US2 への依存関係があるため、完全な並列作業は困難です。優先度順（P1→P2→P3）の順次実行を推奨します。

---

## Notes

- [P] タスク = 異なるファイル、依存関係なし
- [Story] ラベルは特定のユーザーストーリーへのトレーサビリティのためのタスクマッピング
- 各ユーザーストーリーは独立して完成・テスト可能であるべき
- 各タスクまたは論理的なグループの後にコミット
- 任意のチェックポイントで停止して、ストーリーを独立して検証
- 避けるべき: 曖昧なタスク、同じファイルの競合、独立性を壊すストーリー間の依存関係
- このプロジェクトはHugoの静的サイトジェネレータとClaude Codeスラッシュコマンドの組み合わせです
- `/save-conversation`の実装には、Claude Code APIの会話履歴アクセス方法の調査が必要です（research.md参照）
