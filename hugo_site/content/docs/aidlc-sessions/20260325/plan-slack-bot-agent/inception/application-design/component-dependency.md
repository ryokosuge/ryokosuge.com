---
title: "Component Dependencies: Slack Bot with Claude Agent SDK"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Dependency Matrix

| Component | 依存先 | 依存の種類 |
|---|---|---|
| App (index.ts) | Config, SlackHandler, ClaudeHandler, SessionStore, Logger | 初期化・組み立て |
| SlackHandler | MessageFormatter, Logger | 処理時利用 |
| ClaudeHandler | SessionStore, Config, Logger | 処理時利用 |
| SessionStore | （なし） | 独立 |
| MessageFormatter | （なし） | 独立 |
| Config | （なし） | 独立 |
| Logger | （なし） | 独立 |

## Dependency Diagram

```
+-------------------+
|       App         |
|   (index.ts)      |
+-------------------+
  |   |   |   |
  |   |   |   +---------> Config
  |   |   |
  |   |   +-------------> Logger
  |   |
  |   +---> SlackHandler --+--> MessageFormatter
  |           |             |
  |           +-------------+--> Logger
  |
  +-------> ClaudeHandler --+--> SessionStore
              |             |
              +-------------+--> Logger
```

## Communication Patterns

### 1. App → SlackHandler (初期化時)
- **パターン**: メソッド呼び出し（同期）
- **内容**: `registerHandlers(app)` でイベントハンドラーを登録

### 2. SlackHandler → ClaudeHandler (イベント処理時)
- **パターン**: コールバック付き非同期呼び出し
- **内容**: `handleMessage(threadTs, message, onChunk, onComplete, onError)`
- **データフロー**: ユーザーメッセージ → ClaudeHandler → ストリームチャンク → SlackHandler

### 3. ClaudeHandler → SessionStore (セッション管理)
- **パターン**: メソッド呼び出し（同期）
- **内容**: `has()`, `get()`, `set()` でセッションマッピングを管理

### 4. SlackHandler → MessageFormatter (テキスト変換)
- **パターン**: メソッド呼び出し（同期）
- **内容**: `formatToSlackMrkdwn(text)` でストリームチャンクを変換

## Data Flow

```
Slack Event (app_mention)
  |
  | event.text, event.channel, event.thread_ts
  v
SlackHandler
  |
  | userMessage (Bot ID除去済み), threadTs
  v
ClaudeHandler
  |
  | session.send(userMessage)
  | session.stream() --> chunks
  v
onChunk(text) --> MessageFormatter --> SlackHandler.updateMessage
onComplete(fullText) --> MessageFormatter --> SlackHandler.updateMessage
onError(error) --> SlackHandler.postErrorMessage
```

## 外部依存

| 外部サービス | 使用コンポーネント | プロトコル |
|---|---|---|
| Slack Platform | App (bolt-js) | WebSocket (Socket Mode) |
| Slack Web API | SlackHandler | HTTPS (chat.postMessage, chat.update) |
| Claude API | ClaudeHandler (Agent SDK) | HTTPS |
