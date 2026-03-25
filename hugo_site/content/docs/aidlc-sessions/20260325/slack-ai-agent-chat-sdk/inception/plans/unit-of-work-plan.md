---
title: "Unit of Work Plan"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## 分割スコープ
Application Designで定義した8コンポーネントを、Construction Phaseで扱う開発ユニットに分割する。

## 計画

### Part 1: ユニット分割
- [x] ユニット定義（名前・責務・含まれるコンポーネント）
- [x] ユニット間の依存関係マトリクス
- [x] ユーザーストーリーとユニットのマッピング
- [x] コード構成戦略（Greenfield）
- [x] 分割の整合性検証

### Part 2: 成果物生成
- [x] `unit-of-work.md` — ユニット定義
- [x] `unit-of-work-dependency.md` — 依存関係マトリクス
- [x] `unit-of-work-story-map.md` — ストーリーマッピング

---

## 確定したユニット分割

| Unit | Components | Stories |
|---|---|---|
| Unit 1: Core Bot | SlackAdapter, ChatEngine, StateManager | US-1.x, US-2.x, US-5.x |
| Unit 2: AI Agents | AgentRouter, ConversationAgent, CodeInvestigationAgent | US-3.x, US-4.x |
| Unit 3: Infrastructure | HealthCheckServer, Logger | US-6.x |

---

## 質問

### Q1: ユニット分割の粒度
[Answer]: A — 3ユニットで進める
