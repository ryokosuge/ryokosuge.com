---
title: "Unit of Work — Dependency Matrix"
date: 2026-03-25T00:00:00+09:00
draft: false
---
# Unit of Work — Dependency Matrix

## ユニット間依存関係

| Unit | Depends On | Depended By |
|---|---|---|
| Unit 1: Core Bot | Unit 2: AI Agents, Unit 3: Infrastructure | なし |
| Unit 2: AI Agents | Unit 3: Infrastructure (Logger) | Unit 1: Core Bot |
| Unit 3: Infrastructure | なし | Unit 1: Core Bot, Unit 2: AI Agents |

## 依存関係図

```
Unit 3: Infrastructure
    ^          ^
    |          |
Unit 2: AI Agents
    ^
    |
Unit 1: Core Bot
```

## 依存の詳細

### Unit 1 → Unit 2
- **種別**: 実行時依存
- **インターフェース**: `AgentRouter.route()`, `ConversationAgent.execute()`, `CodeInvestigationAgent.execute()`
- **データ**: ChatRequest → AgentResponse

### Unit 1 → Unit 3
- **種別**: 実行時依存
- **インターフェース**: `Logger.info()`, `Logger.error()` 等
- **データ**: ログメッセージ + コンテキスト

### Unit 2 → Unit 3
- **種別**: 実行時依存
- **インターフェース**: `Logger.info()`, `Logger.error()` 等
- **データ**: ログメッセージ + コンテキスト

### Unit 3（HealthCheck） → Unit 1
- **種別**: ヘルスチェック参照（逆方向）
- **インターフェース**: `SlackAdapter.isConnected()`, `StateManager.isHealthy()`
- **注意**: HealthCheckServerはUnit 1のコンポーネントの状態を参照するが、これはDIで注入される参照であり、ユニット間の循環依存ではない

## Construction Phase 推奨順序

| Order | Unit | Rationale |
|---|---|---|
| 1 | Unit 3: Infrastructure | 依存なし。Logger・BootstrapはFoundationとして最初に設計 |
| 2 | Unit 2: AI Agents | Loggerのみに依存。エージェント設計は独立性が高い |
| 3 | Unit 1: Core Bot | Unit 2 + 3に依存。全体統合のオーケストレーション |
