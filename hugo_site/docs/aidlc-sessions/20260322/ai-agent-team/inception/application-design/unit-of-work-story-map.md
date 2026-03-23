---
title: "Unit of Work - Story Map"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Unit of Work - Story Map

## Story to Unit Mapping

| Story | Story Title | Primary Unit | Supporting Units |
|---|---|---|---|
| 0.1 | Slack App接続 | U1: Slack連携 | U6: Storage/Config |
| 0.2 | GitHub連携設定 | U4: GitHub連携 | U6: Storage/Config |
| 0.3 | Devin連携設定 | U5: Devin連携 | U6: Storage/Config |
| 0.4 | Agent LLM設定 | U6: Storage/Config | U3: AI Agents |
| 1.1 | 要件投稿によるミーティング開始 | U2: Orchestration | U1: Slack, U3: Agents |
| 1.2 | 対象リポジトリの指定 | U2: Orchestration | U1: Slack, U6: Config |
| 2.1 | Agent間チャット形式の議論 | U3: AI Agents | U2: Orchestration, U1: Slack |
| 2.2 | ユーザーの介入・方向修正 | U2: Orchestration | U1: Slack |
| 2.3 | 既存コードベースの理解 | U4: GitHub連携 | U2: Orchestration, U3: Agents |
| 3.1 | 構造化されたPlan生成 | U3: AI Agents | U2: Orchestration |
| 3.2 | Plan承認フロー | U2: Orchestration | U1: Slack |
| 3.3 | 議事録のGitHub保存 | U4: GitHub連携 | U2: Orchestration |
| 4.1 | GitHub Issue作成 | U4: GitHub連携 | U2: Orchestration, U3: Agents |
| 4.2 | DevinへのIssue割り当て | U5: Devin連携 | U2: Orchestration, U1: Slack |
| 4.3 | 進捗通知 | U1: Slack連携 | U2: Orchestration |
| 4.4 | 失敗時のエスカレーション | U2: Orchestration | U1: Slack |
| 5.1 | リポジトリ設定 | U6: Storage/Config | U1: Slack |
| 5.2 | リポジトリの動的切り替え | U2: Orchestration | U1: Slack, U6: Config |

## Unit別ストーリー数

| Unit | Primary | Supporting | Total関与 |
|---|---:|---:|---:|
| U1: Slack連携 | 2 | 9 | 11 |
| U2: Orchestration | 5 | 7 | 12 |
| U3: AI Agents | 2 | 4 | 6 |
| U4: GitHub連携 | 3 | 1 | 4 |
| U5: Devin連携 | 1 | 1 | 2 |
| U6: Storage/Config | 2 | 5 | 7 |

## Coverage Check
- **Total Stories**: 18
- **Mapped Stories**: 18
- **Unmapped Stories**: 0
- **Coverage**: 100%

## Unit別実装ボリューム感

| Unit | ボリューム | 理由 |
|---|---|---|
| U1: Slack連携 | 中 | Slack SDK統合、イベントハンドリング、メッセージフォーマット |
| U2: Orchestration | 大 | ミーティングライフサイクル全体、フェーズ遷移、状態管理 |
| U3: AI Agents | 大 | 3Agent実装、プロンプト設計、LLM統合、応答品質チューニング |
| U4: GitHub連携 | 中 | API統合、リポ分析ロジック、Issue生成 |
| U5: Devin連携 | 小 | Slackメッセージ生成のみ |
| U6: Storage/Config | 小-中 | DynamoDBテーブル設計、CRUD、設定コマンド |
