---
title: "Application Design - AI Agent Team"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Application Design - AI Agent Team

## Overview

Slack上でAI Agentチームがミーティング形式で要件整理・設計・タスク分解を行い、Devinに実装を委譲するシステムのアプリケーション設計。

## Architecture Summary

### Design Decisions
| 決定事項 | 選択 | 理由 |
|---|---|---|
| オーケストレーション | Orchestrator型（中央制御） | Agent発言順序・フェーズ遷移を明確に制御できる |
| コンテキスト共有 | メッセージパッシング（Slackスレッド履歴） | 追加インフラ不要、Slackの履歴がそのままコンテキスト |
| 状態管理 | DynamoDB（Config Storeと共有） | Plan・タスクリスト等の構造化データを制限なく保存可能、Config Storeとインフラ共有 |
| Slack通信 | Socket Mode (MVP) → HTTP Events API (本番) | MVP: 公開URL不要で簡単 / 本番: スケーラブル |
| 設定管理 | DynamoDB | 複数リポジトリの動的管理、Slackコマンドによる変更に対応 |
| Agent Framework | Strands Agents (AWS) - パターンC | 各AgentはStrands `Agent`クラスで実装、OrchestratorはStrands のマルチエージェント機能（Swarm/AgentGroup等）があれば利用、なければ通常Pythonコードでフォールバック |
| LLM | 複数LLM対応（Agent別設定） | Agent役割に最適なモデルを選択可能 |

### Layer Architecture
```
Interface Layer     : Slack Gateway, Configuration Commands
Orchestration Layer : Meeting Orchestrator
Agent Layer         : PM Agent, Design Agent, Task Agent
Integration Layer   : Repository Analyzer, GitHub Integration, Devin Integration
Storage Layer       : Meeting State Store (Slack), Config Store (DynamoDB)
```

## Components (10)

| ID | Component | Purpose |
|---|---|---|
| C-1 | Slack Gateway | Slack APIとの通信ゲートウェイ |
| C-2 | Meeting Orchestrator | ミーティングライフサイクル・Agent発言制御 |
| C-3 | PM Agent | 要件整理・スコープ定義・ファシリテーション |
| C-4 | Design Agent | アーキテクチャ検討・設計方針提案 |
| C-5 | Task Agent | タスク分解・Issue仕様書生成 |
| C-6 | Repository Analyzer | リポジトリ分析 |
| C-7 | GitHub Integration | GitHub API通信（Issue作成、ファイルコミット等） |
| C-8 | Devin Integration | Devinへのタスク委譲・進捗監視 |
| C-9 | Meeting State Store | ミーティング状態永続化（DynamoDB） |
| C-10 | Config Store | システム設定管理（DynamoDB） |

## Services (3)

| ID | Service | Orchestrates |
|---|---|---|
| S-1 | Meeting Service | Slack Gateway → Orchestrator → Agents → Plan承認 |
| S-2 | Task Execution Service | GitHub Issue作成 → Devin割当 → 進捗監視 |
| S-3 | Configuration Service | Slackコマンド → Config Store → 結果返答 |

## Core Flow

```
User posts in Slack
       |
       v
[Slack Gateway] receives event
       |
       v
[Config Store] get repo config for channel
       |
       v
[Meeting Orchestrator] starts meeting
       |
       v
[Repository Analyzer] analyzes target repo
       |
       v
[Agent Discussion Loop]  <-- User can intervene anytime
  PM Agent    -> requirements analysis
  Design Agent -> architecture proposal
  Task Agent  -> task decomposition
       |
       v
[PM Agent] generates Plan
       |
       v
[User] approves Plan in Slack
       |
       v
[GitHub Integration] creates Issues + commits Plan/minutes
       |
       v
[Devin Integration] assigns Issues to Devin
       |
       v
[Slack Gateway] notifies progress
```

## Detailed Documents
- [components.md](components.md) - コンポーネント定義・責務・インターフェース
- [component-methods.md](component-methods.md) - メソッドシグネチャ・入出力型
- [services.md](services.md) - サービス定義・オーケストレーションフロー
- [component-dependency.md](component-dependency.md) - 依存関係・通信パターン・データフロー
