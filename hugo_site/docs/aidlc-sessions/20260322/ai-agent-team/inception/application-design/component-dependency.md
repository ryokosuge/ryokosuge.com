---
title: "Component Dependencies"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Component Dependencies

## Dependency Matrix

| Component | Depends On | Depended By |
|---|---|---|
| C-1: Slack Gateway | - | C-2, C-10 |
| C-2: Meeting Orchestrator | C-1, C-3, C-4, C-5, C-6, C-7, C-8, C-9, C-10 | - |
| C-3: PM Agent | C-10 (LLM config) | C-2 |
| C-4: Design Agent | C-10 (LLM config) | C-2 |
| C-5: Task Agent | C-10 (LLM config) | C-2 |
| C-6: Repository Analyzer | C-7 | C-2 |
| C-7: GitHub Integration | - | C-2, C-6 |
| C-8: Devin Integration | C-7 | C-2 |
| C-9: Meeting State Store | - | C-2 |
| C-10: Config Store | - | C-1, C-2, C-3, C-4, C-5 |

## Communication Patterns

### Synchronous (Request-Response)
- Slack Gateway → Meeting Orchestrator: イベント通知
- Meeting Orchestrator → Agents: 発言要求・応答
- Meeting Orchestrator → Repository Analyzer: 分析要求・結果
- Meeting Orchestrator → Config Store: 設定読み取り
- Agents → Config Store: LLM設定読み取り

### Asynchronous (Fire-and-Forget / Callback)
- Meeting Orchestrator → Slack Gateway: メッセージ投稿
- Meeting Orchestrator → Devin Integration: タスク投入
- Devin Integration → Meeting Orchestrator: 進捗コールバック

## Data Flow Diagram

```
+----------+    event     +-------------+    発言指示    +-----------+
|  Slack   | -----------> |  Meeting    | ------------> | PM Agent  |
| Gateway  |              | Orchestrator|               +-----------+
|          | <----------- |             | ------------> +-----------+
+----------+   message    |             |    発言指示    | Design    |
     ^                    |             |               | Agent     |
     |                    |             |               +-----------+
  events                  |             | ------------> +-----------+
  messages                |             |    発言指示    | Task      |
     |                    |             |               | Agent     |
     v                    +------+------+               +-----------+
 [Slack API]                     |
                                 | 分析要求
                                 v
                          +------+------+    GitHub API  +-----------+
                          | Repository  | ------------> | GitHub    |
                          | Analyzer    |               | Integration|
                          +-------------+               +-----+-----+
                                                              |
                          +-------------+    Issue割当   +-----+-----+
                          | Meeting     |               | Devin     |
                          | State Store |               | Integration|
                          +-------------+               +-----------+

                          +-------------+
                          | Config      |  <-- 全コンポーネントから参照
                          | Store       |
                          +-------------+
```

## Layer Architecture

```
+----------------------------------------------------------+
|                    Interface Layer                         |
|  +------------------+  +-------------------------------+  |
|  | Slack Gateway    |  | Configuration Commands        |  |
|  | (C-1)           |  | (via Slack Gateway)            |  |
|  +------------------+  +-------------------------------+  |
+----------------------------------------------------------+
                          |
+----------------------------------------------------------+
|                 Orchestration Layer                        |
|  +--------------------------------------------------+    |
|  | Meeting Orchestrator (C-2)                        |    |
|  | - Meeting lifecycle                               |    |
|  | - Agent turn management                           |    |
|  | - User intervention handling                      |    |
|  +--------------------------------------------------+    |
+----------------------------------------------------------+
                          |
+----------------------------------------------------------+
|                    Agent Layer                             |
|  +--------------+ +--------------+ +------------------+   |
|  | PM Agent     | | Design Agent | | Task Agent       |   |
|  | (C-3)        | | (C-4)        | | (C-5)            |   |
|  +--------------+ +--------------+ +------------------+   |
+----------------------------------------------------------+
                          |
+----------------------------------------------------------+
|                 Integration Layer                          |
|  +----------------+ +------------+ +------------------+   |
|  | Repository     | | GitHub     | | Devin            |   |
|  | Analyzer (C-6) | | Int. (C-7) | | Int. (C-8)       |   |
|  +----------------+ +------------+ +------------------+   |
+----------------------------------------------------------+
                          |
+----------------------------------------------------------+
|                   Storage Layer                            |
|  +---------------------+ +----------------------------+   |
|  | Meeting State Store  | | Config Store               |   |
|  | (C-9: DynamoDB)      | | (C-10: DynamoDB)           |   |
|  +---------------------+ +----------------------------+   |
+----------------------------------------------------------+
```
