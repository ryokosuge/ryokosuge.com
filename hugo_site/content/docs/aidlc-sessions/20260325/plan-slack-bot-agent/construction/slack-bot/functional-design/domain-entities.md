---
title: "Domain Entities: Slack Bot"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Entity 1: AppConfig

アプリケーション設定を表す。

```typescript
type AppConfig = {
  slack: {
    botToken: string;      // SLACK_BOT_TOKEN
    appToken: string;      // SLACK_APP_TOKEN
    signingSecret: string; // SLACK_SIGNING_SECRET
  };
  claude: {
    apiKey: string;        // ANTHROPIC_API_KEY
    model: string;         // CLAUDE_MODEL (default: "claude-sonnet-4-6")
  };
};
```

---

## Entity 2: MentionEvent

`app_mention` イベントから抽出される情報。

```typescript
type MentionEvent = {
  channel: string;         // イベントが発生したチャンネルID
  threadTs: string;        // スレッドのタイムスタンプ（スレッド外の場合はメッセージ自身のts）
  userMessage: string;     // Bot ID除去済みのユーザーメッセージ
  rawText: string;         // 元のメッセージテキスト
};
```

---

## Entity 3: SessionMapping

スレッドとClaude Agentセッションの対応関係。

```typescript
// SessionStore interface
interface SessionStore {
  get(threadTs: string): string | undefined;
  set(threadTs: string, sessionId: string): void;
  has(threadTs: string): boolean;
}
```

**InMemorySessionStoreの内部状態:**
```
Map<string, string>
  key: thread_ts (Slackスレッド識別子)
  value: session_id (Claude Agent SDKセッション識別子)
```

---

## Entity 4: StreamContext

ストリーミング処理中のコンテキスト。

```typescript
type StreamContext = {
  channel: string;           // Slackチャンネル
  messageTs: string;         // 更新対象メッセージのts（仮メッセージのts）
  threadTs: string;          // スレッドts
  accumulatedText: string;   // 蓄積されたストリームテキスト
};
```

---

## Entity Relationships

```
AppConfig
  (設定情報を各コンポーネントに提供)

MentionEvent --[triggers]--> StreamContext
  (メンションイベントがストリーム処理のコンテキストを生成)

SessionMapping --[resolves]--> Claude Agent Session
  (thread_tsからsession_idを解決してセッションを再開)
```
