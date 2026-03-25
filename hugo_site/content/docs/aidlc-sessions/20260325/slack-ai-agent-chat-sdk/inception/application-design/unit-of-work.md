---
title: "Unit of Work Definitions"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## デプロイメントモデル
- **アーキテクチャ**: シングルプロセス モノリス
- **ユニットの意味**: 論理的な開発モジュール（独立デプロイではない）
- **Construction Phaseでの扱い**: 各ユニットごとにFunctional Design → NFR → Infrastructure Designを実施

---

## Unit 1: Core Bot

**Purpose**: Slackとの接続、チャットフローのオーケストレーション、会話状態の管理

**Components**:
- C1: SlackAdapter — Slack Socket Mode接続・イベント処理
- C2: ChatEngine — メッセージ処理フローのオーケストレーション
- C6: StateManager — Redis会話状態の永続化

**Responsibilities**:
- Slackイベント（メンション、DM、スレッド返信）の受信・応答
- メッセージ処理パイプラインの制御
- 会話コンテキストのロード・保存
- エラーハンドリング（固定メッセージ応答）

**External Dependencies**:
- Slack API (WebSocket / Socket Mode)
- Redis
- Unit 2: AI Agents（エージェント実行の委譲）

**Key Design Concerns**:
- Slackイベントの正規化とフィルタリング
- スレッド/DM判定ロジック
- Redis接続管理（再接続、タイムアウト）
- `vercel/chat` SDKと`@chat-adapter/slack`の統合方式

---

## Unit 2: AI Agents

**Purpose**: LLMベースのルーティングとAIエージェントの実行

**Components**:
- C3: AgentRouter — メッセージ分類・ルーティング
- C4: ConversationAgent — 一般会話エージェント
- C5: CodeInvestigationAgent — コード調査エージェント

**Responsibilities**:
- ユーザーメッセージのLLM分類（会話 vs コード調査）
- 会話エージェントによる自然言語応答
- コード調査エージェントによるファイル検索・コード読み取り
- ツール実行結果の自然言語変換

**External Dependencies**:
- Claude API（ルーティング分類、エージェント実行）
- Claude Code ネイティブツール（CodeInvestigationAgent）

**Key Design Concerns**:
- ルーティング分類プロンプトの設計
- Claude Agent SDKのエージェント構成
- ツール定義とツール実行のハンドリング
- エージェント応答のタイムアウト管理

---

## Unit 3: Infrastructure

**Purpose**: アプリケーションの運用基盤（監視・ログ・起動管理）

**Components**:
- C7: HealthCheckServer — HTTPヘルスチェックエンドポイント
- C8: Logger — 構造化ログ出力

**Responsibilities**:
- `/health` エンドポイントの提供（Slack・Redis接続状態）
- JSON構造化ログの出力
- アプリケーション起動・シャットダウン管理（ApplicationBootstrapService）
- DI（依存性注入）の構成

**External Dependencies**:
- Unit 1: Core Bot（ヘルスチェック対象としてSlack・Redis状態を参照）

**Key Design Concerns**:
- ヘルスチェックの判定ロジック（ok / degraded / error）
- ログのコンテキスト伝播方式
- グレースフルシャットダウンの順序

---

## コード構成戦略（Greenfield）

```
src/
  core/                    # Unit 1: Core Bot
    slack-adapter.ts
    chat-engine.ts
    state-manager.ts
    types.ts
  agents/                  # Unit 2: AI Agents
    agent-router.ts
    conversation-agent.ts
    code-investigation-agent.ts
    types.ts
  infra/                   # Unit 3: Infrastructure
    health-check-server.ts
    logger.ts
    bootstrap.ts
  index.ts                 # エントリポイント
```

## Construction Phase 実行順序

1. **Unit 3: Infrastructure**（依存なし、他ユニットが利用するLogger含む）
2. **Unit 2: AI Agents**（Loggerに依存）
3. **Unit 1: Core Bot**（Unit 2 + Unit 3に依存）

この順序により、依存先から先に設計を確定できます。
