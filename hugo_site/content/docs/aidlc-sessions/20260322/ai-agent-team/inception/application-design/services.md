---
title: "Services"
date: 2026-03-22T00:00:00+09:00
draft: false
---
## S-1: Meeting Service

| 項目 | 内容 |
|---|---|
| **Purpose** | Agent Meetingのend-to-endライフサイクル管理 |
| **Orchestrates** | Slack Gateway, Meeting Orchestrator, All Agents, Repository Analyzer, Meeting State Store |

### Service Flow

```
1. [Slack Gateway] ユーザーメッセージ受信
       |
2. [Config Store] チャンネルのリポジトリ設定取得
       |
3. [Meeting Orchestrator] ミーティング開始
       |
4. [Repository Analyzer] リポジトリ分析（初回のみ）
       |
5. [Meeting Orchestrator] Agent Discussion Loop
       |   +-- [PM Agent] 要件分析・ファシリテーション
       |   +-- [Design Agent] 設計提案・レビュー
       |   +-- [Task Agent] タスク分解
       |   +-- (ユーザー介入時) フロー調整
       |
6. [PM Agent] Plan生成
       |
7. [Slack Gateway] Plan承認依頼
       |
8. [ユーザー] Approve / Reject
       |
9. (Approved) → Task Execution Service へ
```

### Agent Discussion Orchestration Pattern

```
Orchestrator制御ループ:

1. 現在のフェーズに基づき、次に発言すべきAgentを決定
2. Slackスレッドの会話履歴をコンテキストとして取得
3. 選択されたAgentに発言を要求
4. Agent応答をSlackスレッドに投稿
5. ユーザーコメントがあれば優先的に処理
6. フェーズ遷移条件を評価
7. 条件未達→1へ戻る / 条件達成→次フェーズへ
```

---

## S-2: Task Execution Service

| 項目 | 内容 |
|---|---|
| **Purpose** | Plan承認後のタスク投入・監視 |
| **Orchestrates** | GitHub Integration, Devin Integration, Slack Gateway |

### Service Flow

```
1. [GitHub Integration] GitHub Issue一括作成
       |
2. [GitHub Integration] 議事録・PlanをMarkdownコミット
       |
3. [Devin Integration] 依存関係順にIssueをDevinに割り当て
       |
4. [Devin Integration] 進捗監視ループ
       |   +-- ステータス変化検知
       |   +-- [Slack Gateway] 進捗通知
       |
5. 全タスク完了 or 失敗時エスカレーション
       |
6. [Slack Gateway] 最終結果通知
```

---

## S-3: Configuration Service

| 項目 | 内容 |
|---|---|
| **Purpose** | Slackコマンドによる設定管理 |
| **Orchestrates** | Slack Gateway, Config Store |

### Service Flow

```
1. [Slack Gateway] 設定コマンド受信（例: /config repo set <url>）
       |
2. [Config Store] 設定の読み取り/更新
       |
3. [Slack Gateway] 結果をユーザーに返答
```

### Supported Commands
- `/config repo set <repo_url>` - チャンネルのデフォルトリポジトリ設定
- `/config repo get` - 現在のリポジトリ設定表示
- `/config llm set <agent_type> <provider> <model>` - Agent別LLM設定
- `/config llm get` - 現在のLLM設定表示
