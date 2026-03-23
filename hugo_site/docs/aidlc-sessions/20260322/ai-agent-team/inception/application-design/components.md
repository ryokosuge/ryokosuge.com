---
title: "Components"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Components

## C-1: Slack Gateway

| 項目 | 内容 |
|---|---|
| **Purpose** | Slack APIとの通信を担当するゲートウェイコンポーネント |
| **Responsibilities** | Slackイベントの受信・パース、Slackメッセージの送信、スレッド管理、Slack Appの認証管理 |
| **Communication Mode** | MVP: Socket Mode / 本番: HTTP Events API |

### Interfaces
- **Inbound**: Slack Events API（message, app_mention, interaction等）
- **Outbound**: Meeting Orchestratorへのイベント通知、Slackスレッドへのメッセージ投稿

---

## C-2: Meeting Orchestrator

| 項目 | 内容 |
|---|---|
| **Purpose** | Agent Meetingのライフサイクル管理と進行制御 |
| **Responsibilities** | ミーティング開始・終了管理、Agent発言順序の制御、ユーザー介入の統合、ミーティングフェーズ遷移、Plan承認フロー管理 |
| **Pattern** | Orchestrator型（中央制御） |
| **Implementation** | Strands AgentsのSwarm/AgentGroup機能があればそれを利用。なければ通常Pythonコードで各Strands Agentを呼び出すフォールバック実装 |

### Interfaces
- **Inbound**: Slack Gatewayからのイベント（新規要件、ユーザーコメント、承認アクション）
- **Outbound**: 各Agentへの発言指示、Slack Gatewayへの投稿依頼、Meeting State Storeへの状態更新

### Meeting Phases
```
INIT → ANALYZING → DISCUSSING → SUMMARIZING → AWAITING_APPROVAL → APPROVED → EXECUTING_TASKS → COMPLETED
```

---

## C-3: PM Agent

| 項目 | 内容 |
|---|---|
| **Purpose** | 要件整理・スコープ定義・ミーティングファシリテーション |
| **Responsibilities** | ユーザー要件の分析・整理、スコープ定義、議題設定、ミーティング結論のまとめ、Planドキュメント生成 |
| **LLM** | 設定により変更可能（Config Storeから取得） |
| **Implementation** | Strands Agents `Agent` クラスで実装 |

### Interfaces
- **Inbound**: Orchestratorからの発言指示（コンテキスト付き）
- **Outbound**: 発言テキスト、Plan構造データ

---

## C-4: Design Agent

| 項目 | 内容 |
|---|---|
| **Purpose** | アーキテクチャ検討・設計方針の提案 |
| **Responsibilities** | 技術的実現可能性の評価、アーキテクチャ提案、既存コードとの整合性チェック、設計方針の文書化 |
| **LLM** | 設定により変更可能（Config Storeから取得） |

### Interfaces
- **Inbound**: Orchestratorからの発言指示（コンテキスト + リポジトリ分析結果）
- **Outbound**: 発言テキスト、設計方針データ

---

## C-5: Task Agent

| 項目 | 内容 |
|---|---|
| **Purpose** | タスク分解・依存関係整理・Issue仕様書生成 |
| **Responsibilities** | 設計をタスク粒度に分解、タスク間依存関係の整理、GitHub Issue用の詳細仕様書生成、実装順序の提案 |
| **LLM** | 設定により変更可能（Config Storeから取得） |

### Interfaces
- **Inbound**: Orchestratorからの発言指示（コンテキスト + 設計方針）
- **Outbound**: 発言テキスト、タスク一覧データ、Issue仕様データ

---

## C-6: Repository Analyzer

| 項目 | 内容 |
|---|---|
| **Purpose** | 対象GitHubリポジトリの既存コードベース分析 |
| **Responsibilities** | リポジトリ構造の取得、使用技術の特定、主要コンポーネントの概要生成、既存アーキテクチャの把握 |

### Interfaces
- **Inbound**: Meeting Orchestratorからの分析リクエスト（リポジトリURL）
- **Outbound**: リポジトリ分析結果（構造、技術スタック、コンポーネント概要）

---

## C-7: GitHub Integration

| 項目 | 内容 |
|---|---|
| **Purpose** | GitHub APIとの通信を担当 |
| **Responsibilities** | GitHub Issue作成、リポジトリ情報取得（Repository Analyzerが利用）、議事録・PlanのMarkdownコミット、PR追跡 |

### Interfaces
- **Inbound**: Repository Analyzer / Meeting Orchestrator / Task Agentからのリクエスト
- **Outbound**: GitHub API呼び出し結果

---

## C-8: Devin Integration

| 項目 | 内容 |
|---|---|
| **Purpose** | Devinへのタスク委譲と進捗監視 |
| **Responsibilities** | Slack上で@DevinメンションによりGitHub Issueの実装を依頼、Devinの応答・進捗をSlackスレッドで監視 |
| **連携方式** | Slack @メンション（Devin Slack Bot経由） |

### Interfaces
- **Inbound**: Meeting Orchestratorからのタスク投入指示
- **Outbound**: Slack Gateway経由で@Devinメンションメッセージ送信

### Note
Devin Slack Botが同一ワークスペースにインストール済みである前提。専用APIではなくSlackメッセージ経由で連携するため、実装はSlack Gatewayのメッセージ送信機能を利用する。

---

## C-9: Meeting State Store

| 項目 | 内容 |
|---|---|
| **Purpose** | ミーティング状態の永続化 |
| **Responsibilities** | ミーティングフェーズ・議題・結論の保存、Plan・タスクリストの構造化データ保存、Slackスレッドとの紐付け管理 |
| **Storage** | DynamoDB（Config Storeと同一テーブルまたは同一DynamoDBインスタンス） |

### Interfaces
- **Inbound**: Meeting Orchestratorからの状態更新
- **Outbound**: 状態読み取り結果

### Data Model
- **Partition Key**: `meeting_id`（channel + thread_ts から生成）
- **Attributes**: phase, agenda, conclusions, plan, task_list, repo_url, created_at, updated_at

---

## C-10: Config Store

| 項目 | 内容 |
|---|---|
| **Purpose** | システム設定の管理 |
| **Responsibilities** | チャンネル-リポジトリ紐付け管理、Agent別LLM設定管理、Slackコマンドによる動的設定変更 |
| **Storage** | DynamoDB |

### Interfaces
- **Inbound**: Slack Gateway（設定コマンド）、各コンポーネントからの設定読み取り
- **Outbound**: 設定データ
