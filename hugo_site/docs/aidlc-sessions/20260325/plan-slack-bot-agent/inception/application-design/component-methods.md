---
title: "Component Methods: Slack Bot with Claude Agent SDK"
date: 2026-03-25T00:00:00+09:00
draft: false
---

# Component Methods: Slack Bot with Claude Agent SDK

> **Note**: ビジネスルールの詳細はFunctional Design（CONSTRUCTION Phase）で定義する。
> ここではメソッドシグネチャと高レベルの目的のみ記載。

---

## App (src/index.ts)

### main()
- **Purpose**: アプリケーション初期化・起動
- **Input**: なし
- **Output**: `Promise<void>`
- **Notes**: Config検証 → bolt-js App初期化 → ハンドラー登録 → `app.start()`

---

## Config (src/config.ts)

### loadConfig()
- **Purpose**: 環境変数を読み込み、検証済みの設定オブジェクトを返す
- **Input**: なし（`process.env` から読み込み）
- **Output**: `AppConfig`
- **Throws**: 必須環境変数が未設定の場合

### AppConfig 型定義
```typescript
type AppConfig = {
  slack: {
    botToken: string;
    appToken: string;
    signingSecret: string;
  };
  claude: {
    apiKey: string;
    model: string; // デフォルト値あり
  };
};
```

---

## SlackHandler (src/handlers/slack-handler.ts)

### registerHandlers(app: App)
- **Purpose**: bolt-js Appにイベントハンドラーを登録
- **Input**: `app: App` - bolt-jsのAppインスタンス
- **Output**: `void`

### postThinkingMessage(client, channel, threadTs)
- **Purpose**: 「考え中...」仮メッセージをスレッドに投稿
- **Input**: `client: WebClient`, `channel: string`, `threadTs: string`
- **Output**: `Promise<string>` - 投稿されたメッセージのts

### updateMessage(client, channel, ts, text)
- **Purpose**: 既存メッセージをストリーミングテキストで更新
- **Input**: `client: WebClient`, `channel: string`, `ts: string`, `text: string`
- **Output**: `Promise<void>`

### postErrorMessage(client, channel, threadTs, error)
- **Purpose**: エラー情報をスレッドに投稿
- **Input**: `client: WebClient`, `channel: string`, `threadTs: string`, `error: Error`
- **Output**: `Promise<void>`

---

## ClaudeHandler (src/agent/claude-handler.ts)

### constructor(sessionStore, config)
- **Purpose**: ClaudeHandler初期化
- **Input**: `sessionStore: SessionStore`, `config: AppConfig['claude']`

### handleMessage(threadTs, userMessage, onChunk, onComplete, onError)
- **Purpose**: ユーザーメッセージを処理し、Claude応答をストリーミングで返す
- **Input**:
  - `threadTs: string` - スレッドID
  - `userMessage: string` - ユーザーメッセージ（Bot ID除去済み）
  - `onChunk: (text: string) => void` - チャンク受信コールバック
  - `onComplete: (fullText: string) => void` - 完了コールバック
  - `onError: (error: Error) => void` - エラーコールバック
- **Output**: `Promise<void>`
- **Notes**: threadTsからセッション検索 → 存在すればresumeSession、なければcreateSession → send → stream

---

## SessionStore (src/agent/session-store.ts)

### get(threadTs)
- **Purpose**: スレッドIDに対応するセッションIDを取得
- **Input**: `threadTs: string`
- **Output**: `string | undefined`

### set(threadTs, sessionId)
- **Purpose**: スレッドIDとセッションIDのマッピングを保存
- **Input**: `threadTs: string`, `sessionId: string`
- **Output**: `void`

### has(threadTs)
- **Purpose**: スレッドIDに対応するセッションが存在するか確認
- **Input**: `threadTs: string`
- **Output**: `boolean`

---

## MessageFormatter (src/utils/message-formatter.ts)

### formatToSlackMrkdwn(markdown)
- **Purpose**: Markdown記法をSlack mrkdwn形式に変換
- **Input**: `markdown: string`
- **Output**: `string`

---

## Logger (src/utils/logger.ts)

### info(message, ...args)
- **Purpose**: 情報ログ出力
- **Input**: `message: string`, `...args: unknown[]`
- **Output**: `void`

### error(message, ...args)
- **Purpose**: エラーログ出力
- **Input**: `message: string`, `...args: unknown[]`
- **Output**: `void`

### debug(message, ...args)
- **Purpose**: デバッグログ出力
- **Input**: `message: string`, `...args: unknown[]`
- **Output**: `void`
