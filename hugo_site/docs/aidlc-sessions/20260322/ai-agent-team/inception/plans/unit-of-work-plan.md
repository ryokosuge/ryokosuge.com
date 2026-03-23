---
title: "Unit of Work Plan"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Unit of Work Plan

## Plan Overview
Application Designで定義した10コンポーネントを、独立して開発可能なUnit of Workに分解する。

## Execution Steps

### Phase 1: Unit Decomposition
- [x] Unit定義（名前、責務、含まれるコンポーネント）
- [x] 各Unitの技術スコープ定義

### Phase 2: Dependencies
- [x] Unit間依存関係の整理
- [x] 実装順序の決定

### Phase 3: Story Mapping
- [x] 各ストーリーをUnitにマッピング
- [x] カバレッジ確認

### Phase 4: Code Organization
- [x] ディレクトリ構造の定義
- [x] 共有コード・インターフェースの整理

---

## Questions

### Question 1
Unit分解の粒度について。10コンポーネントをどのレベルでUnitに分けますか？

A) 細粒度（5-6 Unit）: Slack連携、Orchestration、AI Agents、GitHub連携、Devin連携、Storage/Config — コンポーネントのレイヤーごとに分離
B) 中粒度（3-4 Unit）: Core Platform（Slack+Orchestration+State）、AI Agents（3Agent）、External Integrations（GitHub+Devin）、Config/Storage
C) 粗粒度（2 Unit）: Agent System（Slack+Orchestration+Agents）、Integrations（GitHub+Devin+Storage）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
デプロイモデルについて。各Unitは独立してデプロイ可能にしますか？

A) モノリス: 全Unitを1つのデプロイパッケージにまとめる（シンプル、MVP向き）
B) モジュラーモノリス: 1つのデプロイだが、Unit間はインターフェースで分離（将来のマイクロサービス化に備える）
C) マイクロサービス: 各Unitを独立デプロイ（最初からスケーラブル、ただしインフラ複雑）
D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3
コードのディレクトリ構造について。

A) フラット構造: `src/slack/`, `src/agents/`, `src/github/`, `src/devin/` のように機能ごと
B) レイヤー構造: `src/interface/`, `src/orchestration/`, `src/agents/`, `src/integration/`, `src/storage/`
C) Unit構造: 各Unitをトップレベルディレクトリにする（`core-platform/`, `ai-agents/`, `integrations/`）
D) Other (please describe after [Answer]: tag below)

[Answer]: B
