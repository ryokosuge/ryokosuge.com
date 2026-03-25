---
title: "Requirements Document"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Intent Analysis

- **User Request**: Vercel Chat SDK (`vercel/chat`) と Claude Agent SDK を使って、Slack上でAI Agentと対話できるSlackボットを構築する
- **Request Type**: New Project（新規プロジェクト）
- **Scope Estimate**: Multiple Components（Slack Adapter + AI Agent + 状態管理 + インフラ）
- **Complexity Estimate**: Complex（マルチエージェント、ツール利用、複数技術統合）
- **Delivery Scope**: 設計フェーズまで（コード生成は今回のスコープ外）

---

## Functional Requirements

### FR-1: Slack Bot 基本機能
- Slackワークスペースにボットとして参加できること
- メンション（@bot）でボットを呼び出せること
- スレッド内で継続的な会話ができること
- ダイレクトメッセージでも対話できること

### FR-2: AI Agent — シンプルな会話
- Claude Agent SDKを使用したAIエージェントが自然言語で応答すること
- コンテキストを保持した会話ができること（スレッド単位）

### FR-3: AI Agent — ツール利用（Claude Code）
- Claude Codeのネイティブ能力（ファイル検索、コード読み取り等）を利用すること
- ツールの実行結果をユーザーに分かりやすく返すこと

### FR-4: AI Agent — マルチエージェント
- 複数のエージェントが協調して問題を解決できること
- タスクの性質に応じて適切なエージェントにルーティングされること
- エージェント間の結果を統合してユーザーに返すこと

### FR-5: 会話状態管理
- Redisを使用して会話履歴を永続化すること
- スレッド単位で会話コンテキストを管理すること
- `vercel/chat` SDKの状態管理アダプタ（`@chat-adapter/state-redis`）を利用すること

---

## Non-Functional Requirements

### NFR-1: Platform
- **チャットプラットフォーム**: Slack（`@chat-adapter/slack`使用）
- **SDK**: `vercel/chat`（コアSDK）+ Claude Agent SDK
- **言語**: TypeScript

### NFR-2: Infrastructure
- **デプロイ先**: AWS
- **状態管理**: Redis（AWS ElastiCache等）
- **リポジトリ**: 既存ryokosuge.comリポジトリとは別リポジトリで管理

### NFR-3: Security
- Security extension: 適用しない（PoC / プロトタイプ段階）
- Slack APIトークン、Anthropic APIキーの安全な管理は最低限考慮する

### NFR-4: Scalability
- 初期段階ではシングルワークスペース対応で十分
- 将来的にマルチワークスペース対応可能な設計とする

---

## Technical Stack Summary

| Layer | Technology |
|---|---|
| Chat SDK | `vercel/chat` (chat パッケージ) |
| Slack Adapter | `@chat-adapter/slack` |
| State Management | `@chat-adapter/state-redis` + Redis |
| AI Agent | Claude Agent SDK (`claude_agent_sdk`) |
| Language | TypeScript |
| Runtime | Bun |
| Deploy | AWS |
| Repository | 新規独立リポジトリ |

---

## Architecture Overview (Conceptual)

```
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|   Slack           | <---> |   vercel/chat     | <---> |  Claude Agent SDK |
|   (User)          |       |   (Bot Core)      |       |  (AI Agents)      |
|                   |       |                   |       |                   |
+-------------------+       +--------+----------+       +--------+----------+
                                     |                           |
                                     v                           v
                            +--------+----------+       +--------+----------+
                            |                   |       |                   |
                            |   Redis           |       |   Tools           |
                            |   (State)         |       |   (Claude Code)   |
                            |                   |       |                   |
                            +-------------------+       +-------------------+
```

---

## Constraints
- 今回のスコープは**設計フェーズまで**（コード生成は含まない）
- 別リポジトリで開発するため、このワークスペース内にアプリケーションコードは作成しない
- ドキュメント成果物のみ `aidlc-docs/` に出力する
