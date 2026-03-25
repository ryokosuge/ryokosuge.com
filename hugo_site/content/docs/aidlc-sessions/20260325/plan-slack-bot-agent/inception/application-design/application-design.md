---
title: "Application Design: Slack Bot with Claude Agent SDK"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Overview

bolt-js + Claude Agent SDK v2 Preview + Bun構成のSlack Bot。
Socket Modeでイベントを受信し、Claude Agent SDKでAI応答をストリーミング表示する。

---

## Architecture

```
+-------------------+     WebSocket      +-------------------+
|                   | <================> |                   |
|   Slack Platform  |   (Socket Mode)    |   Slack Bot App   |
|                   | ================> |   (Bun + bolt-js) |
+-------------------+   app_mention      +-------------------+
                                                |
                                                | send() / stream()
                                                v
                                         +-------------------+
                                         | Claude Agent SDK  |
                                         |   v2 Preview      |
                                         | (Session-based)   |
                                         +-------------------+
                                                |
                                                | API
                                                v
                                         +-------------------+
                                         |  Claude API       |
                                         |  (Anthropic)      |
                                         +-------------------+
```

---

## Module Structure

```
src/
  index.ts                # エントリーポイント: App初期化、ハンドラー登録、起動
  config.ts               # 環境変数読み込み・検証
  handlers/
    slack-handler.ts      # Slackイベント処理、メッセージ送信・更新
  agent/
    claude-handler.ts     # Claude Agent SDK連携、セッション管理
    session-store.ts      # SessionStoreインターフェース + InMemory実装
  utils/
    logger.ts             # ログユーティリティ
    message-formatter.ts  # Markdown → Slack mrkdwn変換
```

---

## Components Summary

| Component | File | Responsibilities |
|---|---|---|
| App | `src/index.ts` | 初期化・起動 |
| Config | `src/config.ts` | 環境変数管理 |
| SlackHandler | `src/handlers/slack-handler.ts` | イベント処理、メッセージ投稿・更新 |
| ClaudeHandler | `src/agent/claude-handler.ts` | Agent SDK連携、セッション管理 |
| SessionStore | `src/agent/session-store.ts` | thread_ts → session_id マッピング |
| MessageFormatter | `src/utils/message-formatter.ts` | Markdown → Slack mrkdwn変換 |
| Logger | `src/utils/logger.ts` | コンソールログ出力 |

詳細: [components.md](./components.md)

---

## Key Design Decisions

### 1. ストリーミング更新方式
- **決定**: 都度更新（チャンクごとに即時 `chat.update`）
- **理由**: ユーザーが選択。リアルタイム体験を最優先
- **リスク**: Slack APIレートリミット → NFR Designで対処

### 2. セッション管理
- **決定**: SessionStoreインターフェース + InMemorySessionStore実装
- **理由**: 将来の永続化に対応可能な抽象化を維持しつつ、初期実装はシンプルに
- **トレードオフ**: プロセス再起動でセッションリセット（許容）

### 3. メッセージフォーマット
- **決定**: Markdown → Slack mrkdwn変換
- **理由**: Claudeの応答はMarkdown形式、Slackは独自のmrkdwn形式

### 4. コールバックパターン
- **決定**: ClaudeHandlerは `onChunk/onComplete/onError` コールバックで結果を返す
- **理由**: SlackHandlerとClaudeHandlerの疎結合を維持。ストリーミング処理に適合。

---

## Detailed Documents
- [components.md](./components.md) - コンポーネント定義と責務
- [component-methods.md](./component-methods.md) - メソッドシグネチャ
- [services.md](./services.md) - サービス定義とオーケストレーション
- [component-dependency.md](./component-dependency.md) - 依存関係とデータフロー
