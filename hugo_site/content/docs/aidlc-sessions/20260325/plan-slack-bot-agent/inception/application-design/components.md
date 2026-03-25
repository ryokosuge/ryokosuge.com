---
title: "Components: Slack Bot with Claude Agent SDK"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Component 1: App (エントリーポイント)

| 項目 | 内容 |
|---|---|
| **ファイル** | `src/index.ts` |
| **責務** | アプリケーションの初期化と起動 |

### Responsibilities
- bolt-js Appインスタンスの初期化（Socket Mode）
- イベントハンドラーの登録
- アプリケーション起動

### Interface
- `main()`: アプリケーション起動のエントリーポイント

---

## Component 2: Config

| 項目 | 内容 |
|---|---|
| **ファイル** | `src/config.ts` |
| **責務** | 環境変数の読み込みと検証 |

### Responsibilities
- `.env` ファイルからの環境変数読み込み
- 必須環境変数の存在チェック
- 型安全な設定オブジェクトの提供

### Interface
- `config: AppConfig` - 検証済みの設定オブジェクト（読み取り専用）

---

## Component 3: SlackHandler

| 項目 | 内容 |
|---|---|
| **ファイル** | `src/handlers/slack-handler.ts` |
| **責務** | Slackイベント処理、メッセージ送信・更新 |

### Responsibilities
- `app_mention` イベントの処理
- メンションテキストからBot IDの除去
- スレッドへの仮メッセージ（「考え中...」）投稿
- `chat.update` によるストリーミングメッセージ更新
- エラーメッセージのスレッド投稿

### Interface
- `registerHandlers(app: App): void` - bolt-js Appにイベントハンドラーを登録
- `postThinkingMessage(client, channel, threadTs): Promise<string>` - 仮メッセージ投稿、メッセージtsを返す
- `updateMessage(client, channel, ts, text): Promise<void>` - メッセージ更新
- `postErrorMessage(client, channel, threadTs, error): Promise<void>` - エラーメッセージ投稿

---

## Component 4: ClaudeHandler

| 項目 | 内容 |
|---|---|
| **ファイル** | `src/agent/claude-handler.ts` |
| **責務** | Claude Agent SDK v2連携、セッションライフサイクル管理 |

### Responsibilities
- 新規セッション作成（`unstable_v2_createSession`）
- 既存セッション再開（`unstable_v2_resumeSession`）
- メッセージ送信（`session.send`）
- ストリーム受信（`session.stream`）とコールバック呼び出し
- `session_id` の抽出とセッションストアへの保存

### Interface
- `handleMessage(threadTs, userMessage, onChunk, onComplete, onError): Promise<void>` - メッセージ処理のメインメソッド
  - `onChunk(text: string)`: ストリームチャンク受信時のコールバック
  - `onComplete(fullText: string)`: ストリーム完了時のコールバック
  - `onError(error: Error)`: エラー発生時のコールバック

---

## Component 5: SessionStore

| 項目 | 内容 |
|---|---|
| **ファイル** | `src/agent/session-store.ts` |
| **責務** | `thread_ts` → `session_id` マッピングの管理 |

### Responsibilities
- セッションIDの保存
- スレッドIDからのセッションID検索
- セッション存在チェック

### Interface (抽象)
```typescript
interface SessionStore {
  get(threadTs: string): string | undefined;
  set(threadTs: string, sessionId: string): void;
  has(threadTs: string): boolean;
}
```

### Implementation
- `InMemorySessionStore`: `Map<string, string>` によるインメモリ実装

---

## Component 6: MessageFormatter

| 項目 | 内容 |
|---|---|
| **ファイル** | `src/utils/message-formatter.ts` |
| **責務** | Markdown → Slack mrkdwn形式への変換 |

### Responsibilities
- Markdown記法をSlack mrkdwn記法に変換
  - `**bold**` → `*bold*`
  - `[text](url)` → `<url|text>`
  - コードブロックの変換
  - その他の記法変換

### Interface
- `formatToSlackMrkdwn(markdown: string): string` - Markdown → Slack mrkdwn変換

---

## Component 7: Logger

| 項目 | 内容 |
|---|---|
| **ファイル** | `src/utils/logger.ts` |
| **責務** | コンソールログ出力 |

### Responsibilities
- アプリケーション起動ログ
- イベント受信ログ
- エラーログ

### Interface
- `info(message: string, ...args: unknown[]): void`
- `error(message: string, ...args: unknown[]): void`
- `debug(message: string, ...args: unknown[]): void`
