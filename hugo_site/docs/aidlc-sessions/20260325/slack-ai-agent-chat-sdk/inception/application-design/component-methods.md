---
title: "Component Methods"
date: 2026-03-25T00:00:00+09:00
draft: false
---
# Component Methods

> **Note**: 詳細なビジネスロジックはFunctional Design（CONSTRUCTION Phase）で定義します。
> ここではメソッドシグネチャと高レベルの目的を定義します。

---

## C1: SlackAdapter

### `start(): Promise<void>`
- **Purpose**: Socket Mode接続を確立し、イベントリスナーを登録
- **Input**: なし
- **Output**: なし（接続確立後にイベント駆動で動作）

### `stop(): Promise<void>`
- **Purpose**: Socket Mode接続を切断
- **Input**: なし
- **Output**: なし

### `handleMessageEvent(event: SlackMessageEvent): Promise<void>`
- **Purpose**: Slackメッセージイベントを処理し、ChatEngineに委譲
- **Input**: `SlackMessageEvent` — チャンネルID、スレッドID、ユーザーID、テキスト等
- **Output**: なし（ChatEngine経由でSlackに応答）

### `sendMessage(channel: string, threadTs: string, text: string): Promise<void>`
- **Purpose**: Slackチャンネル/スレッドにメッセージを送信
- **Input**: チャンネルID、スレッドタイムスタンプ、メッセージテキスト
- **Output**: なし

### `showTypingIndicator(channel: string, threadTs: string): void`
- **Purpose**: タイピングインジケータを表示
- **Input**: チャンネルID、スレッドタイムスタンプ
- **Output**: なし

### `isConnected(): boolean`
- **Purpose**: Slack接続状態を返す（HealthCheck用）
- **Input**: なし
- **Output**: 接続状態

---

## C2: ChatEngine

### `processMessage(request: ChatRequest): Promise<ChatResponse>`
- **Purpose**: メッセージ処理の全体フローをオーケストレーション
- **Input**: `ChatRequest` — userId, channelId, threadId, text
- **Output**: `ChatResponse` — responseText, metadata

### `buildContext(threadId: string): Promise<ConversationContext>`
- **Purpose**: StateManagerから会話コンテキストを取得・構築
- **Input**: スレッドID
- **Output**: `ConversationContext` — messages配列、メタデータ

---

## C3: AgentRouter

### `route(message: string, context: ConversationContext): Promise<AgentType>`
- **Purpose**: メッセージ内容をLLMで分析し、ルーティング先を決定
- **Input**: ユーザーメッセージ、会話コンテキスト
- **Output**: `AgentType` — `"conversation"` | `"code_investigation"`

---

## C4: ConversationAgent

### `execute(message: string, context: ConversationContext): Promise<AgentResponse>`
- **Purpose**: 一般的な会話・質問に対する応答を生成
- **Input**: ユーザーメッセージ、会話コンテキスト
- **Output**: `AgentResponse` — responseText, toolResults（空配列）

---

## C5: CodeInvestigationAgent

### `execute(message: string, context: ConversationContext): Promise<AgentResponse>`
- **Purpose**: コード調査タスクを実行し、結果を応答として返す
- **Input**: ユーザーメッセージ、会話コンテキスト
- **Output**: `AgentResponse` — responseText, toolResults

---

## C6: StateManager

### `getHistory(threadId: string): Promise<Message[]>`
- **Purpose**: スレッドの会話履歴をRedisから取得
- **Input**: スレッドID
- **Output**: メッセージ配列

### `saveMessage(threadId: string, message: Message): Promise<void>`
- **Purpose**: メッセージをRedisに保存
- **Input**: スレッドID、メッセージ
- **Output**: なし

### `isHealthy(): Promise<boolean>`
- **Purpose**: Redis接続の健全性を確認（HealthCheck用）
- **Input**: なし
- **Output**: 接続状態

---

## C7: HealthCheckServer

### `start(port: number): Promise<void>`
- **Purpose**: HTTPサーバーを起動
- **Input**: ポート番号
- **Output**: なし

### `getHealthStatus(): Promise<HealthStatus>`
- **Purpose**: 各コンポーネントの状態を集約してヘルスステータスを返す
- **Input**: なし
- **Output**: `HealthStatus` — status, slack, redis

---

## C8: Logger

### `info(message: string, context?: LogContext): void`
- **Purpose**: INFOレベルのログ出力
- **Input**: メッセージ、コンテキスト（requestId, userId, channelId等）
- **Output**: JSON標準出力

### `warn(message: string, context?: LogContext): void`
- **Purpose**: WARNレベルのログ出力

### `error(message: string, error?: Error, context?: LogContext): void`
- **Purpose**: ERRORレベルのログ出力（スタックトレース含む）

---

## 型定義（概要）

```typescript
type AgentType = "conversation" | "code_investigation";

interface ChatRequest {
  userId: string;
  channelId: string;
  threadId: string;
  text: string;
}

interface ChatResponse {
  responseText: string;
  metadata?: Record<string, unknown>;
}

interface ConversationContext {
  threadId: string;
  messages: Message[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AgentResponse {
  responseText: string;
  toolResults: ToolResult[];
}

interface HealthStatus {
  status: "ok" | "degraded" | "error";
  slack: boolean;
  redis: boolean;
}

interface LogContext {
  requestId?: string;
  userId?: string;
  channelId?: string;
  threadId?: string;
  [key: string]: unknown;
}
```
