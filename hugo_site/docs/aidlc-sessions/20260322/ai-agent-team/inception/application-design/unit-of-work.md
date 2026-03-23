---
title: "Unit of Work Definitions"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Unit of Work Definitions

## Deploy Model
**モジュラーモノリス**: 1つのデプロイパッケージだが、Unit間はインターフェースで明確に分離。将来のマイクロサービス化に備える。

## Code Organization
**レイヤー構造**:
```
src/
  interface/           # Unit 1: Slack連携
    slack_gateway.py
    event_handlers.py
    message_formatter.py
  orchestration/       # Unit 2: Orchestration
    meeting_orchestrator.py
    meeting_state.py
    phase_manager.py
  agents/              # Unit 3: AI Agents
    base_agent.py
    pm_agent.py
    design_agent.py
    task_agent.py
  integration/         # Unit 4 & 5: External Integrations
    github/
      github_client.py
      repo_analyzer.py
      issue_manager.py
    devin/
      devin_messenger.py
  storage/             # Unit 6: Storage/Config
    config_store.py
    dynamodb_client.py
  shared/              # 共有インターフェース・型定義
    types.py
    interfaces.py
    exceptions.py
```

---

## Unit 1: Slack連携

| 項目 | 内容 |
|---|---|
| **Name** | slack-interface |
| **Components** | C-1: Slack Gateway |
| **Responsibilities** | Slackイベント受信・パース、メッセージ送信、スレッド管理、インタラクション処理、設定コマンド処理 |
| **Tech Scope** | Slack SDK (Bolt for Python), Socket Mode / HTTP Events API |
| **Interfaces** | `SlackEventHandler` (inbound), `SlackMessageSender` (outbound) |

---

## Unit 2: Orchestration

| 項目 | 内容 |
|---|---|
| **Name** | meeting-orchestration |
| **Components** | C-2: Meeting Orchestrator, C-9: Meeting State Store |
| **Responsibilities** | ミーティングライフサイクル管理、Agent発言順序制御、ユーザー介入処理、フェーズ遷移、Plan承認フロー、状態永続化 |
| **Tech Scope** | Strands Agents (Swarm/AgentGroup or Python fallback), DynamoDB |
| **Interfaces** | `MeetingManager` (inbound), `AgentInvoker` (outbound to agents), `StateStore` (outbound to storage) |

---

## Unit 3: AI Agents

| 項目 | 内容 |
|---|---|
| **Name** | ai-agents |
| **Components** | C-3: PM Agent, C-4: Design Agent, C-5: Task Agent |
| **Responsibilities** | 要件分析、設計提案、タスク分解、各専門領域からの議論参加、Plan生成、Issue仕様書生成 |
| **Tech Scope** | Strands Agents `Agent` クラス, 複数LLMプロバイダー対応 |
| **Interfaces** | `BaseAgent` (共通インターフェース), `AgentResponse` (output type) |

---

## Unit 4: GitHub連携

| 項目 | 内容 |
|---|---|
| **Name** | github-integration |
| **Components** | C-6: Repository Analyzer, C-7: GitHub Integration |
| **Responsibilities** | リポジトリ分析、GitHub Issue作成、ファイルコミット（議事録・Plan保存）、PR追跡 |
| **Tech Scope** | GitHub API (PyGithub or httpx), リポジトリ解析 |
| **Interfaces** | `GitHubClient` (API通信), `RepoAnalyzer` (分析結果) |

---

## Unit 5: Devin連携

| 項目 | 内容 |
|---|---|
| **Name** | devin-integration |
| **Components** | C-8: Devin Integration |
| **Responsibilities** | @Devinメンションによるタスク実装依頼メッセージ生成、Devin向けメッセージフォーマット |
| **Tech Scope** | Slack Gateway経由のメッセージ送信（独自API不要） |
| **Interfaces** | `DevinMessenger` (メッセージ生成・送信) |

### Note
Devin IntegrationはSlack Gateway経由でメッセージを送るだけなので、実装ボリュームは小さい。Unit 4 (GitHub連携) と統合することも検討可能だが、責務の分離のため独立Unitとする。

---

## Unit 6: Storage/Config

| 項目 | 内容 |
|---|---|
| **Name** | storage-config |
| **Components** | C-10: Config Store (+ DynamoDB共有基盤) |
| **Responsibilities** | DynamoDBクライアント管理、チャンネル-リポジトリ設定CRUD、Agent別LLM設定CRUD、ミーティング状態テーブル定義 |
| **Tech Scope** | boto3 (DynamoDB), テーブル設計・マイグレーション |
| **Interfaces** | `ConfigStore`, `DynamoDBClient` |
