---
title: "Application Design — 統合設計ドキュメント"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## 概要

Slack上でAI Agentと対話できるチャットボットのアプリケーション設計。
`vercel/chat` SDKをコアに、Claude Agent SDKでAIエージェントを構築し、Redisで会話状態を永続化する。

## 設計方針

| 項目 | 決定 |
|---|---|
| エージェントルーティング | LLMベース（Claude APIでメッセージ分類） |
| Slack接続方式 | Socket Mode（将来Events APIへ拡張可能） |
| プロセス構成 | シングルプロセス（ボット + HealthCheck HTTP） |
| エラーハンドリング | シンプル（固定エラーメッセージ） |

---

## コンポーネント一覧（8コンポーネント）

| ID | Component | Purpose | Technology |
|---|---|---|---|
| C1 | SlackAdapter | Slack接続・イベント処理 | `@chat-adapter/slack` |
| C2 | ChatEngine | チャットフローのオーケストレーション | `vercel/chat` SDK |
| C3 | AgentRouter | LLMベースのエージェントルーティング | Claude API |
| C4 | ConversationAgent | 一般会話・質問応答 | Claude Agent SDK |
| C5 | CodeInvestigationAgent | コード調査・ファイル検索 | Claude Agent SDK + Claude Code |
| C6 | StateManager | 会話状態の永続化 | `@chat-adapter/state-redis` + Redis |
| C7 | HealthCheckServer | 死活監視HTTPエンドポイント | Bun HTTP server |
| C8 | Logger | 構造化ログ出力 | pino等 |

詳細: [components.md](./components.md)

---

## メソッドシグネチャ（主要）

| Component | Method | Input → Output |
|---|---|---|
| SlackAdapter | `handleMessageEvent()` | SlackEvent → void（ChatEngine呼出） |
| ChatEngine | `processMessage()` | ChatRequest → ChatResponse |
| AgentRouter | `route()` | message + context → AgentType |
| ConversationAgent | `execute()` | message + context → AgentResponse |
| CodeInvestigationAgent | `execute()` | message + context → AgentResponse |
| StateManager | `getHistory()` / `saveMessage()` | threadId → Message[] / void |
| HealthCheckServer | `getHealthStatus()` | void → HealthStatus |

詳細: [component-methods.md](./component-methods.md)

---

## サービス層（3サービス）

| ID | Service | Purpose |
|---|---|---|
| S1 | MessageProcessingService | メッセージ受信→応答の全フロー管理 |
| S2 | AgentOrchestrationService | エージェント実行・タイムアウト管理 |
| S3 | ApplicationBootstrapService | 起動・シャットダウン・DI管理 |

詳細: [services.md](./services.md)

---

## メッセージ処理フロー

```
User @mentions bot in Slack
        |
        v
  SlackAdapter (receives WebSocket event)
        |
        v
  ChatEngine.processMessage()
        |
        +---> StateManager.getHistory()  ... 会話コンテキスト取得
        |
        +---> AgentRouter.route()        ... LLMでルーティング判断
        |         |
        |         +---> "conversation"     → ConversationAgent.execute()
        |         +---> "code_investigation" → CodeInvestigationAgent.execute()
        |
        +---> StateManager.saveMessage() ... 履歴保存
        |
        v
  SlackAdapter.sendMessage()  ... Slackに応答送信
```

---

## 依存関係

```
SlackAdapter ──→ ChatEngine ──→ AgentRouter
                            ──→ ConversationAgent
                            ──→ CodeInvestigationAgent
                            ──→ StateManager ──→ Redis

HealthCheckServer ──→ SlackAdapter (接続状態)
                  ──→ StateManager (Redis状態)

Logger ←── 全コンポーネント
```

詳細: [component-dependency.md](./component-dependency.md)

---

## 外部システム連携

| System | Protocol | Component |
|---|---|---|
| Slack API | WebSocket (Socket Mode) | SlackAdapter |
| Redis | TCP | StateManager |
| Claude API | HTTPS | AgentRouter, ConversationAgent, CodeInvestigationAgent |

---

## 将来の拡張ポイント

1. **Socket Mode → Events API**: マルチワークスペース対応時にHTTPベースに切り替え
2. **エージェント追加**: AgentRouterのルーティングルールとエージェント実装を追加するだけで拡張可能
3. **マルチワークスペース**: SlackAdapterのインスタンスをワークスペースごとに管理
