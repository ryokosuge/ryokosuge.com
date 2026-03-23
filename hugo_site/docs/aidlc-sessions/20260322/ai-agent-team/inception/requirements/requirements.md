---
title: "Requirements Document: AI Agent Team"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Requirements Document: AI Agent Team

## Intent Analysis

- **User Request**: Slack上で要件相談・設計ディスカッションを行い、計画が固まったらDevinにタスクを投げて開発まで進めてくれるAI Agentチームを作りたい
- **Request Type**: New Project（新規プロジェクト）
- **Scope**: Cross-system（Slack + AI Agent Orchestration + Devin API + GitHub連携）
- **Complexity**: Complex（マルチエージェント連携、外部サービス統合、リアルタイムインタラクション）
- **Target User**: 個人利用（開発者個人の生産性向上ツール）

---

## System Overview

Slackをインターフェースとして、複数のAI Agentが「チームミーティング」形式で要件整理・設計・タスク分解を行い、確定した計画に基づいてDevinに実装タスクを自動投入するシステム。

### Core Concept Flow

```
User (Slack)
    |
    v
[Slackチャンネルに要件投稿]
    |
    v
[AI Agent Team Meeting開始] ← ユーザーが随時介入可能
    |  (Slack Thread内)
    |  - PM Agent: 要件整理・スコープ定義
    |  - 設計Agent: アーキテクチャ・設計検討
    |  - タスク分解Agent: タスク分解・依存関係整理
    |
    v
[Plan確定] → ユーザー承認(Slack上)
    |
    v
[GitHub Issueにタスク書き出し]
    |  - 詳細な仕様書レベルのIssue作成
    |  - タスク間依存関係の設定
    |
    v
[DevinにIssueを渡して実装依頼]
    |  - 進捗をSlackに通知
    |
    v
[PR作成・テスト実行]
    |
    v
[議事録・PlanをGitHubリポジトリにMarkdown保存]
```

---

## Functional Requirements

### FR-1: Slack連携
- **FR-1.1**: Slackチャンネルへの投稿をトリガーとしてAI Agent Teamのミーティングを開始する
- **FR-1.2**: Slackスレッド内でAI Agent同士が短いメッセージで頻繁にやりとりし、チャット形式で議論する
- **FR-1.3**: ユーザーがスレッド内で随時コメント・方向修正を行える（インタラクティブ形式）
- **FR-1.4**: 最終的なPlanの承認をユーザーに求める（Slack上でApprove/Reject）
- **FR-1.5**: Devinのタスク進捗・結果をSlackに通知する
- **FR-1.6**: 複数リポジトリ対応（チャンネルまたは投稿ごとに対象リポジトリを指定）

### FR-2: AI Agent Team Orchestration
- **FR-2.1**: MVP 3体構成: PM Agent、設計Agent、タスク分解Agent
- **FR-2.2**: Agent間の対話・連携を管理するオーケストレーション機能
- **FR-2.3**: 各Agentが専門的な視点で議論に参加し、構造化された出力を生成する
- **FR-2.4**: ミーティングの進行管理（議題設定、発言順、結論まとめ）
- **FR-2.5**: ユーザーの介入をミーティングフローに統合する機能
- **FR-2.6**: 対象リポジトリの既存コードベースを理解した上で議論を行う

### FR-3: Plan生成
- **FR-3.1**: 要件整理結果を構造化ドキュメントとして出力
- **FR-3.2**: 設計方針を文書化
- **FR-3.3**: タスク分解結果を詳細な仕様書レベル（要件・設計方針・実装指示を含む）で生成
- **FR-3.4**: タスク間の依存関係を整理
- **FR-3.5**: ユーザー承認フロー（Slack上でのApprove/Reject）
- **FR-3.6**: 議事録・PlanをGitHubリポジトリにMarkdownとしてコミット保存

### FR-4: Devin連携
- **FR-4.1**: 確定したタスクをGitHub Issueとして書き出し、Devinに渡す
- **FR-4.2**: タスク単位でのIssue作成（依存関係に基づく順序付け）
- **FR-4.3**: Devinの作業進捗を監視
- **FR-4.4**: Devinの作業結果（PR作成、テスト結果）を収集
- **FR-4.5**: 失敗時のリトライ・エスカレーション（Slackに通知）

### FR-5: GitHub連携
- **FR-5.1**: 対象リポジトリの情報取得（構造、既存コード理解）
- **FR-5.2**: タスク仕様をGitHub Issueとして作成
- **FR-5.3**: DevinのPR作成結果の追跡
- **FR-5.4**: テスト実行結果の確認
- **FR-5.5**: 議事録・PlanのMarkdownコミット
- **FR-5.6**: 複数リポジトリの管理対応

---

## Non-Functional Requirements

### NFR-1: Technology Stack
- **フレームワーク**: Strands Agents（AWS）
- **LLM**: 複数LLMを組み合わせ（Agent役割ごとに最適なLLMを選択可能）
- **実行環境**: AWS
- **ランタイム**: Python（Strands Agents標準）
- **リポジトリ**: GitHub

### NFR-2: Performance
- **Slack応答**: ミーティング開始トリガーから最初のAgent応答まで数秒以内
- **Agent間対話**: 各Agentの応答は自然な議論ペースで生成（即時である必要なし）

### NFR-3: Reliability
- **Agent障害時**: 他のAgentに影響を与えない（各Agentは独立動作）
- **Devin連携失敗時**: リトライ後、Slackに失敗通知

### NFR-4: Security
- **現時点ではPoC/プロトタイプレベル** - 本格的なセキュリティ対策は後のフェーズで実施
- APIキー・トークンは環境変数で管理

---

## Out of Scope (MVP)
- コードレビューの自動化（PRの作成までが範囲）
- 複数ユーザーの同時利用
- Web UI / Dashboard
- デプロイの自動化（CI/CD）
- 本格的なセキュリティ対策
- Agent自身によるコード生成（Devinに委譲）

---

## Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
