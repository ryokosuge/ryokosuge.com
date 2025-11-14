# Implementation Plan: Claude Conversation Logs

**Branch**: `001-claude-conversation-logs` | **Date**: 2025-11-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-claude-conversation-logs/spec.md`

## Summary

Claude Codeとの会話をワンコマンドでブログ記事として保存する機能を追加します。`/save-conversation`スラッシュコマンドを実行すると、現在の会話セッション全体を自動的に取得し、AIが タイトル・要約・タグを自動生成し、時系列フォーマットで`content/conversations/`ディレクトリにMarkdownファイルを作成します。プライバシー保護のためランダム32文字IDをファイル名として使用し、手動でのファイル作成・編集は不要です。既存のHugoブログ構造とryokosuge-themeカスタムテーマにシームレスに統合されます。

## Technical Context

**Language/Version**: Go (Hugo 0.118.0以上推奨), Claude Code slash command (Markdown)
**Primary Dependencies**: Hugo (静的サイトジェネレータ), ryokosuge-themeカスタムテーマ (Tailwind CSS), Claude Code API (会話履歴アクセス)
**Storage**: ファイルシステム（Markdown形式、UTF-8エンコーディング）
**Testing**: 実際の会話後に`/save-conversation`実行、ローカルプレビュー（`hugo server -D`）で確認
**Target Platform**: 静的Webサイト（HTML/CSS/JS）、ryokosuge.com
**Project Type**: 静的サイト（Hugo）+ スラッシュコマンド自動化
**Performance Goals**: `/save-conversation`実行から完了まで10秒以内、AI分析含む
**Constraints**: Claude Code会話履歴APIへのアクセス、既存テーマとの互換性、AIによる自動生成の品質
**Scale/Scope**: 小規模（会話ログページは月数件程度を想定、1回の会話は数十〜数百メッセージ想定）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Content-First Workflow
- 会話ログは`/save-conversation`スラッシュコマンドで自動生成される
- Hugoフロントマター（title, date, draft, tags）を自動生成
- AIによる対話形式の支援が組み込まれている（タイトル・要約・タグの自動生成）

### ✅ II. Template-Based Creation
- Hugoアーキタイプ（archetypes/conversations.md）は自動生成の参考として使用
- ランダム32文字英数字IDを使用（research-logs、english-conversationと同じパターン）
- スラッシュコマンドが適切な構造でファイルを生成

### ✅ III. Japanese & English Support
- 日本語・英語両方のコンテンツをサポート
- UTF-8エンコーディングで日本語文字を正しく処理
- 既存のryokosuge-themeカスタムテーマがUTF-8をサポート済み

### ✅ IV. Git-Based Publishing
- すべての変更はGitコミット必須
- PRワークフロー対応
- mainブランチから静的サイト生成・デプロイ

### ✅ V. Local Development First
- `make server`または`hugo server -D`でローカルプレビュー必須
- Hugoの開発サーバーで確認してから公開

### ✅ VI. Japanese-First Communication
- AIアシスタントとのやりとりは日本語
- スラッシュコマンドも日本語で実行

**判定**: すべての憲法原則に準拠。違反なし。

## Project Structure

### Documentation (this feature)

```text
specs/001-claude-conversation-logs/
├── spec.md              # 機能仕様書
├── plan.md              # このファイル（実装計画）
├── research.md          # Phase 0 調査結果
├── data-model.md        # Phase 1 データモデル
├── quickstart.md        # Phase 1 クイックスタートガイド
└── tasks.md             # Phase 2 タスクリスト（/speckit.tasksで生成）
```

### Source Code (repository root)

```text
.claude/commands/
├── (既存のコマンド)
└── save-conversation.md    # 新規追加：会話保存スラッシュコマンド

archetypes/
├── daily-logs.md           # 既存
├── research-logs.md        # 既存
├── english-conversation.md # 既存
└── conversations.md        # 新規追加（参考用、自動生成で使用）

content/
├── daily-logs/             # 既存
├── research-logs/          # 既存
├── english-conversation/   # 既存
└── conversations/          # 新規追加（/save-conversationが自動作成）
    └── [32文字ランダムID].md  # スラッシュコマンドで自動生成

config.yaml                 # Hugo設定（mainSections、menuに追加必要）

themes/
└── ryokosuge-theme/       # カスタムテーマ（Tailwind CSS）
```

**Structure Decision**: このプロジェクトはHugoベースの静的サイトジェネレータ + Claude Codeスラッシュコマンドによる自動化を組み合わせた構成です。`/save-conversation`スラッシュコマンドが会話履歴を取得し、AI分析を行い、適切なMarkdownファイルを`content/conversations/`に自動生成します。手動でのファイル作成・編集は不要です。カスタムテーマ（ryokosuge-theme）はTailwind CSSベースで構築されており、新しいコンテンツタイプも既存パターンで表示されます。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

憲法違反なし。このセクションは不要。

## Phase 0: Research & Technical Decisions

### 調査項目

この機能は**スラッシュコマンドによる自動化**という新しい要素を含むため、以下の技術調査が必要です：

1. **Claude Code会話履歴へのアクセス方法**
   - 決定事項: 調査が必要（Claude Codeのコンテキストから会話履歴を取得する方法）
   - 根拠: スラッシュコマンド実行時に現在の会話セッション全体にアクセスする必要がある
   - 調査内容: 利用可能なAPI、コンテキスト変数、または内部メカニズム

2. **AI分析機能の実装方法**
   - 決定事項: 調査が必要（タイトル・要約・タグの自動生成方法）
   - 根拠: 会話内容から適切なメタデータを生成する必要がある
   - 調査内容: Claude自身の分析能力を活用する方法、プロンプト設計

3. **スラッシュコマンドの実装パターン**
   - 決定事項: 既存の`.claude/commands/`パターンを踏襲
   - 根拠: `/daily`、`/research`、`/english`などの既存コマンドと同じ構造
   - 調査内容: 既存コマンドの実装を参考にする

4. **ランダムID生成方法**
   - 決定事項: `openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32` を使用
   - 根拠: CLAUDE.mdの既存パターンと同じ

5. **会話フォーマットの設計**
   - 決定事項: 時系列フォーマット、ユーザーとClaudeのメッセージを区別
   - 根拠: 読みやすさと会話の流れの保持
   - 検討内容: タイムスタンプの形式、メッセージの区切り方

6. **Hugo設定の更新要否**
   - 決定事項: config.yamlの更新が**必要**（mainSections、menu.mainにconversationsを追加）
   - 根拠: 既存の3つのコンテンツタイプも明示的に登録されている

### 代替案の検討

- **作成方法**: 手動コマンド vs スラッシュコマンド → スラッシュコマンド採用（ユーザーエクスペリエンス重視）
- **メタデータ生成**: 手動入力 vs AI自動生成 → AI自動生成採用（手間削減、一貫性向上）
- **会話取得範囲**: 全セッション vs 直近N件 vs ユーザー選択 → 全セッション採用（シンプル、完全性重視）
- **フォーマット**: Q&A vs 時系列 vs トピック別 → 時系列採用（自然な流れ、実装が容易）

## Phase 1: Design Artifacts

### データモデル (data-model.md)

会話ログエンティティ:
- ファイル名: 32文字ランダム英数字ID
- フロントマター: title, date, draft, description, tags（すべてAI自動生成）
- コンテンツ: 時系列フォーマットの会話ログ（ユーザーメッセージ + Claudeレスポンス）
- メタデータ: タイムスタンプ、発言者区別

詳細は `data-model.md` を参照。

### スラッシュコマンド設計 (contracts/)

`/save-conversation` コマンドの動作フロー:

1. **会話履歴取得**: 現在のセッション全体を取得
2. **AI分析**:
   - タイトル生成（会話の主題を1文で）
   - 要約生成（2-3文で重要ポイントを抽出）
   - タグ生成（3-5個のキーワード抽出）
3. **ファイル生成**:
   - ランダムID生成
   - Markdownファイル作成（フロントマター + 会話内容）
   - `content/conversations/`に保存
4. **完了通知**: ファイルパスと確認メッセージを表示

詳細な実装仕様は `contracts/slash-command-spec.md` を参照。

### クイックスタートガイド (quickstart.md)

`/save-conversation`スラッシュコマンドの使用方法を記載。
詳細は `quickstart.md` を参照。

## Next Steps

1. ✅ Phase 0: 調査項目の特定（会話履歴アクセス、AI分析方法など）
2. 🔄 Phase 1: データモデル、スラッシュコマンド仕様、クイックスタートガイドを生成
3. ⏳ Phase 2: `/speckit.tasks`でタスクリストを生成（スラッシュコマンド実装、テストなど）
4. ⏳ Phase 3: `/speckit.implement`で実装実行
