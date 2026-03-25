---
title: "Code Generation Plan: Slack Bot with Claude Agent SDK"
date: 2026-03-25T00:00:00+09:00
draft: false
---

# Code Generation Plan: Slack Bot with Claude Agent SDK

> **This plan is the single source of truth for Code Generation.**
> Part 2（Generation）ではこのプランに従って順番にコードを生成する。

## Unit Context
- **Unit**: slack-bot（単一ユニット）
- **Project Type**: Greenfield
- **Workspace Root**: /home/user/ryokosuge.com
- **Code Location**: Workspace root（`src/` 配下）
- **Stories**: US-01〜US-17

## Target Project Structure
```
/home/user/ryokosuge.com/
  .devcontainer/
    devcontainer.json          # Step 1
  src/
    index.ts                   # Step 3
    config.ts                  # Step 2
    handlers/
      slack-handler.ts         # Step 5
    agent/
      claude-handler.ts        # Step 7
      session-store.ts         # Step 6
    utils/
      logger.ts                # Step 4
      message-formatter.ts     # Step 8
  tests/
    config.test.ts             # Step 2
    handlers/
      slack-handler.test.ts    # Step 5
    agent/
      claude-handler.test.ts   # Step 7
      session-store.test.ts    # Step 6
    utils/
      logger.test.ts           # Step 4
      message-formatter.test.ts # Step 8
  package.json                 # Step 1
  tsconfig.json                # Step 1
  .env.example                 # Step 1
  .gitignore                   # Step 1
```

---

## Execution Steps

### Step 1: プロジェクト基盤セットアップ
- [ ] `package.json` 作成（name, scripts, dependencies）
  - dependencies: `@slack/bolt`, `@anthropic-ai/claude-agent-sdk`
  - scripts: `"start": "bun run src/index.ts"`
- [ ] `tsconfig.json` 作成（strict: true, Bun向け設定）
- [ ] `.gitignore` 作成（node_modules, .env, dist）
- [ ] `.env.example` 作成（必要な環境変数のテンプレート）
- [ ] `.devcontainer/devcontainer.json` 作成
  - ベースイメージ: Ubuntu
  - Features: Claude Code (`anthropics.claude-code`), Bun
  - postCreateCommand: `bun install`
- [ ] `bun install` 実行

**関連ストーリー**: US-14（環境変数設定）, US-15（Bun起動）, US-16（Dev Container）

---

### Step 2: Config モジュール
- [ ] `src/config.ts` 作成
  - `AppConfig` 型定義
  - 環境変数読み込み（Bunの`.env`自動読み込み活用）
  - 必須環境変数の一括バリデーション（Fail-Fast: DP-05）
  - `CLAUDE_MODEL` デフォルト値: `"claude-sonnet-4-6"`
- [ ] `tests/config.test.ts` 作成
  - 全必須変数設定時の正常系テスト
  - 各必須変数未設定時のエラーテスト
  - デフォルト値テスト

**関連ストーリー**: US-14
**関連設計**: BR-05（環境変数バリデーションルール）, DP-05

---

### Step 3: エントリーポイント
- [ ] `src/index.ts` 作成
  - Config読み込み
  - bolt-js App初期化（Socket Mode）
  - SlackHandler登録
  - `app.start()` 呼び出し
  - 起動ログ出力

**関連ストーリー**: US-15（Bun起動）
**関連設計**: components.md - App

---

### Step 4: Logger ユーティリティ
- [ ] `src/utils/logger.ts` 作成
  - `info()`, `error()`, `debug()` メソッド
  - タイムスタンプ付きコンソール出力
- [ ] `tests/utils/logger.test.ts` 作成
  - 各ログレベルの出力テスト

**関連ストーリー**: US-17（基本ログ出力）
**関連設計**: components.md - Logger

---

### Step 5: SlackHandler
- [ ] `src/handlers/slack-handler.ts` 作成
  - `registerHandlers(app)`: `app_mention` イベントハンドラー登録
  - メンションテキストからBot ID除去（BL-01）
  - `threadTs` 決定ロジック（BR-02）
  - `postThinkingMessage()`: 「考え中...」仮メッセージ投稿
  - `updateMessage()`: Throttled Update（DP-01, LC-01）
    - MIN_UPDATE_INTERVAL: 1000ms
    - 最終更新はバイパス
    - 429レスポンス対応（Retry-After）
  - `postErrorMessage()`: エラー詳細投稿（LC-02）
  - Per-Request Error Boundary（DP-02）
  - ClaudeHandler呼び出し（onChunk/onComplete/onErrorコールバック）
  - onChunk内でMessageFormatter.formatToSlackMrkdwn適用
- [ ] `tests/handlers/slack-handler.test.ts` 作成
  - Bot ID除去テスト
  - threadTs決定ロジックテスト
  - Throttled Update間隔テスト
  - エラーハンドリングテスト

**関連ストーリー**: US-01, US-02, US-03, US-04, US-05, US-06, US-11, US-13
**関連設計**: BL-01, BL-03, BR-02, BR-04, DP-01, DP-02, DP-04, LC-01, LC-02

---

### Step 6: SessionStore
- [ ] `src/agent/session-store.ts` 作成
  - `SessionStore` インターフェース定義（get, set, has）
  - `InMemorySessionStore` 実装（`Map<string, string>`）
- [ ] `tests/agent/session-store.test.ts` 作成
  - set/get/has の正常系テスト
  - 存在しないキーのgetテスト（undefined）
  - 上書きテスト

**関連ストーリー**: US-08, US-09, US-10
**関連設計**: domain-entities.md - SessionMapping, NFR-02

---

### Step 7: ClaudeHandler
- [ ] `src/agent/claude-handler.ts` 作成
  - `constructor(sessionStore, config)`: 初期化
  - `handleMessage(threadTs, userMessage, onChunk, onComplete, onError)`: メイン処理
  - Session Resolver（LC-03）:
    - SessionStore検索 → resumeSession or createSession
    - resumeSession失敗時のフォールバック（DP-03）
  - `session.send()` → `session.stream()` 処理
  - Stream Text Extractor（LC-04）: SDKMessageからテキスト抽出
  - `session_id` キャプチャ（BR-07）: 初回ストリームメッセージからsession_id取得
  - ストリーミング中断保護（DP-04）
- [ ] `tests/agent/claude-handler.test.ts` 作成
  - 新規セッション作成フローテスト
  - セッション再開フローテスト
  - フォールバックテスト
  - ストリームテキスト抽出テスト
  - エラーハンドリングテスト

**関連ストーリー**: US-07, US-08, US-09, US-10, US-11, US-12, US-13
**関連設計**: BL-02, BL-03, BL-04, BR-03, BR-06, BR-07, DP-03, DP-04, LC-03, LC-04

---

### Step 8: MessageFormatter
- [ ] `src/utils/message-formatter.ts` 作成
  - `formatToSlackMrkdwn(markdown)`: Markdown → Slack mrkdwn変換
  - 変換ルール実装（BL-05）:
    - `**bold**` → `*bold*`
    - `*italic*` → `_italic_`
    - `~~strike~~` → `~strike~`
    - `[text](url)` → `<url|text>`
    - `# heading` → `*heading*`
    - コードブロック内はスキップ
- [ ] `tests/utils/message-formatter.test.ts` 作成
  - 各変換ルールの個別テスト
  - コードブロック内のスキップテスト
  - 複合記法テスト
  - エッジケーステスト（空文字、記法なし等）

**関連ストーリー**: US-04, US-06
**関連設計**: BL-05

---

### Step 9: 統合・ドキュメント
- [ ] `src/index.ts` 更新: 全コンポーネントの組み立て（DI）
  - Config → SessionStore → ClaudeHandler → SlackHandler → App起動
- [ ] コード生成サマリー作成: `aidlc-docs/construction/slack-bot/code/code-summary.md`
  - 生成ファイル一覧
  - ストーリートレーサビリティ
  - テスト一覧

**関連ストーリー**: US-15（起動）

---

## Story Traceability Matrix

| Story | Step | Component |
|---|---|---|
| US-01: メンション受信 | Step 5 | SlackHandler |
| US-02: 新規スレッド応答 | Step 5 | SlackHandler |
| US-03: 仮メッセージ | Step 5 | SlackHandler |
| US-04: ストリーミング | Step 5, 8 | SlackHandler, MessageFormatter |
| US-05: レートリミット | Step 5 | SlackHandler (Throttled Update) |
| US-06: 応答完了 | Step 5, 8 | SlackHandler, MessageFormatter |
| US-07: スレッド会話継続 | Step 7 | ClaudeHandler |
| US-08: セッション作成 | Step 6, 7 | SessionStore, ClaudeHandler |
| US-09: セッション再開 | Step 6, 7 | SessionStore, ClaudeHandler |
| US-10: セッション未発見 | Step 7 | ClaudeHandler |
| US-11: Agent SDKエラー | Step 5, 7 | SlackHandler, ClaudeHandler |
| US-12: セッションエラー | Step 7 | ClaudeHandler |
| US-13: ストリーミング中エラー | Step 5, 7 | SlackHandler, ClaudeHandler |
| US-14: 環境変数 | Step 1, 2 | package.json, Config |
| US-15: Bun起動 | Step 1, 3, 9 | package.json, index.ts |
| US-16: Dev Container | Step 1 | devcontainer.json |
| US-17: ログ | Step 4 | Logger |

---

## Summary
- **Total Steps**: 9
- **Files to Create**: 17（ソース8 + テスト7 + 設定2）
- **All 17 Stories Covered**: US-01〜US-17
